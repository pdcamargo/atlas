use serde::{Deserialize, Serialize};

use crate::handle::Handle;

#[derive(Debug, Serialize, Deserialize)]
struct Asset {
    handle: Handle,
    path: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct AssetRegistry {
    assets: Vec<Asset>,
}