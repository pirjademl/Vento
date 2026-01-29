package services

import (
	"log"
	"os"

	storage_go "github.com/supabase-community/storage-go"
)

func CreateSupabaseStorageClient() *storage_go.Client {
	supabaseEndpoint := os.Getenv("SUPABASE_STORAGE_ENDPOINT")
	supabaseSecretKey := os.Getenv("SUPABASE_SECRET_KEY")

	if supabaseEndpoint == "" || supabaseSecretKey == "" {
		log.Fatal("cannot create supasbse storage client")
		return nil
	}
	storageClient := storage_go.NewClient(
		supabaseEndpoint,
		supabaseSecretKey,
		map[string]string{"Content-Type": "application/json"},
	)
	return storageClient
}
