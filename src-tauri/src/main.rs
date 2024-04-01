// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod handle;
pub mod scene;
pub mod asset_registry;

use walkdir::WalkDir;

#[tauri::command]
fn list_files_recursively(path: String) -> Vec<String> {
    let mut paths = Vec::new();
    for entry in WalkDir::new(path)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        paths.push(entry.path().to_string_lossy().into_owned());
    }
    paths
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_files_recursively])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
