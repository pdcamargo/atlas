use serde::{Deserialize, Serialize};

use crate::handle::Handle;

#[derive(Debug, Serialize, Deserialize)]
pub struct Scene {
    id: String,
    name: String,
    assets: Vec<Handle>,
    preload_assets: Vec<Handle>,
    game_objects: Vec<()>, // Using `Vec<()>` to represent an empty array
}