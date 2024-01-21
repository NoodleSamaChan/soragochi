use std::{sync::Arc, time::Duration};

use axum::{
    extract::State,
    routing::{get, put},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use tokio::{sync::Mutex, time};
use tower_http::services::{ServeDir, ServeFile};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

const SAVE_FILE_PATH: &str = "save_file.json";

#[derive(Debug, Default, Clone, Copy, Serialize, Deserialize)]
enum Mood {
    #[default]
    Normal,
    Tired,
    #[serde(rename = "Very tired")]
    VeryTired,
}

#[derive(Debug, Default, Serialize, Deserialize)]
struct Sora {
    hunger: usize,
    tiredness: usize,
    mood: Mood,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "example_static_file_server=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let sora = match tokio::fs::read(SAVE_FILE_PATH).await {
        Ok(bytes) => serde_json::from_slice(&bytes).unwrap(),
        Err(_) => Sora::default(),
    };

    let sora = Arc::new(Mutex::new(sora));

    // build our application with a route
    let app = Router::new()
        .route_service("/", ServeFile::new("static/index.html"))
        .nest_service("/static", ServeDir::new("static"))
        .route("/status", get(status))
        .route("/feed", put(feed))
        .route("/sleep", put(sleep))
        .with_state(sora.clone());

    tokio::spawn(async move {
        loop {
            time::sleep(Duration::from_secs(3)).await;
            tick(sora.clone()).await;
        }
    });

    // run it
    let listener = tokio::net::TcpListener::bind("127.0.0.1:5000")
        .await
        .unwrap();
    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

#[axum::debug_handler]
async fn status(State(sora): State<Arc<Mutex<Sora>>>) -> Json<(usize, usize, Mood)> {
    let sora = sora.lock().await;
    Json((sora.hunger, sora.tiredness, sora.mood))
}

#[axum::debug_handler]
async fn feed(State(sora): State<Arc<Mutex<Sora>>>) -> Json<[usize; 1]> {
    let mut sora = sora.lock().await;
    sora.hunger = 0;
    Json([sora.hunger])
}

#[axum::debug_handler]
async fn sleep(State(sora): State<Arc<Mutex<Sora>>>) -> Json<[usize; 1]> {
    let mut sora = sora.lock().await;
    sora.tiredness = 0;
    Json([sora.tiredness])
}

async fn tick(sora: Arc<Mutex<Sora>>) {
    let mut sora = sora.lock().await;
    sora.tiredness += 1;
    match sora.tiredness {
        ..=4 => sora.mood = Mood::Normal,
        5..=7 => sora.mood = Mood::Tired,
        8..=9 => sora.mood = Mood::VeryTired,
        10.. => println!("Sora is too tired to play, please let him sleep"),
    }

    sora.hunger += 1;
    if sora.hunger == 10 {
        println!("Sora is hungry, feed him!");
    }

    let save = serde_json::to_string_pretty(&*sora).unwrap();
    drop(sora);

    if let Err(e) = tokio::fs::write(SAVE_FILE_PATH, &save).await {
        println!("Couldn't write the save file: {e}");
    }
}
