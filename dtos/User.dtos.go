package dtos

type RegisterUser struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Username  string `json:"username"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
type LoginResponse struct {
	AccessToken string `json:"access_token"`
	Username    string `json:"username"`
}
type UserJwt struct {
	UserId int
	RegisterUser
}

type ContextKey string

var UserContext ContextKey = "user"
