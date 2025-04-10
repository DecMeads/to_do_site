use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use mongodb::{ 
	bson::{doc, oid::ObjectId},
	Client,
	Collection 
};
use axum::{
	routing::get,
	Json,
    Router,
    http::Method,
    http::header::HeaderName
};
use tower_http::cors::{Any, CorsLayer};
use futures_util::TryStreamExt;
use chrono::Local;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let mongo_uri = std::env::var("MONGO_DB_URI").expect("MONGO_DB_URI must be set");
    let client = Client::with_uri_str(mongo_uri).await.expect("Failed to connect to MongoDB");
    let db = client.database("to_do");

    let collection = db.collection::<Todo>("items");

    println!("Connected to MongoDB");

    let app = Router::new()
        .route("/", get(|| async {"Hello Rust Backend!"}))
        .route("/todos", get(get_todos).post(create_todos).put(update_todos).delete(delete_todos))
        .layer(CorsLayer::new()
            .allow_origin(Any)
            .allow_methods(vec![Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
            .allow_headers(vec![HeaderName::from_static("content-type")])
        )
        .with_state(collection);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_todos(
    collection: axum::extract::State<Collection<Todo>>,
) -> Json<Vec<Todo>> {
    println!("Fetching todos...");
    let todos: Vec<Todo> = collection
        .find(doc!{})
        .await.unwrap()
        .try_collect()
        .await
        .unwrap();
    Json(todos)
}


async fn create_todos(
    collection: axum::extract::State<Collection<Todo>>,
    Json(payload): Json<CreateTodoPayload>
) -> Json<Todo> {
    println!("Creating new todo...");
    let todo = Todo {
        id: ObjectId::new(),
        title: payload.title,
        description: payload.description,
        completed: false,
        created_at: Local::now().to_string()
    };

    collection.insert_one(&todo).await.unwrap();
    Json(todo)
}

async fn update_todos(
    collection: axum::extract::State<Collection<Todo>>,
    Json(payload): Json<CompleteTodoPayload>
) -> Json<Todo> {
    let todo_id = match ObjectId::parse_str(&payload.id) {
        Ok(id) => id,
        Err(e) => {
            println!("Error parsing ObjectId: {}", e);
            return Json(Todo {
                id: ObjectId::new(),
                title: "Error".to_string(),
                description: "Invalid ID format".to_string(),
                completed: false,
                created_at: Local::now().to_string()
            });
        }
    };
    
    let todo = collection.find_one_and_update(
        doc!{"_id": todo_id},
        doc!{"$set": {"completed": true}}
    ).await.unwrap();
    Json(todo.unwrap())
}

async fn delete_todos(
    collection: axum::extract::State<Collection<Todo>>,
    Json(payload): Json<DeleteTodoPayload>
) -> Json<Todo> {
    let todo_id = match ObjectId::parse_str(&payload.id) {
        Ok(id) => id,
        Err(e) => {
            println!("Error parsing ObjectId: {}", e);
            return Json(Todo {
                id: ObjectId::new(),
                title: "Error".to_string(),
                description: "Invalid ID format".to_string(),
                completed: false,
                created_at: Local::now().to_string()
            });
        }
    };
    
    let todo = collection.find_one_and_delete(doc!{"_id": todo_id}).await.unwrap();
    Json(todo.unwrap())
}

#[derive(Debug, Serialize, Deserialize)]
struct Todo {
    #[serde(rename = "_id")]
    id: ObjectId,
    title: String,
    description: String,
    completed: bool,
    created_at: String
}

#[derive(Debug, Deserialize)]
struct CreateTodoPayload {
    title: String,
    description: String,
}


#[derive(Debug, Deserialize)]
struct CompleteTodoPayload {
    id: String
}

#[derive(Debug, Deserialize)]
struct DeleteTodoPayload {
    id: String
}