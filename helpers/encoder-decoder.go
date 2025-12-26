package helpers

import (
	"chat/dtos"
	"encoding/json"
	"net/http"
)

// what i want to do
// decode is the main functionality as of Now I want to acheive
type Decoder struct {
	body *dtos.RegisterUser
}

func (d *Decoder) DecodeRequestBody(t any, r http.Request) {
	json.NewDecoder(r.Body).Decode(&d)
}
