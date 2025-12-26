package utils

import (
	"fmt"

	"github.com/google/uuid"
)

func GenerateUUID() uuid.UUID {
	id := uuid.New()
	fmt.Println(id)
	return id
}
