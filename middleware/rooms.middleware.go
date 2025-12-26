package middleware

func CheckClaims(validCreds []bool) bool {
	for _, val := range validCreds {
		if val == false {
			return val
		}
	}
	return true

}

//func RoomAuthMiddleware(next http.Handler) http.Handler {
//	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
//		header := strings.Split(r.Header.Get("Authorization"), " ")
//		if len(header) == 0 || len(header) == 1 {
//			http.Error(w, "AUTHENTICATION FAILED", http.StatusForbidden)
//			return
//		}
//		secret := os.Getenv("JWT_SECRET")
//		token := header[1]
//		if token == "" {
//			http.Error(w, "AUTHENTICATION FAILED", http.StatusForbidden)
//			log.Println("token is empty")
//			return
//		}
//		claims := jwt.MapClaims{}
//		_, err := jwt.ParseWithClaims(token, claims, func(t *jwt.Token) (any, error) {
//			return []byte(secret), nil
//		})
//		if err != nil {
//			http.Error(w, err.Error(), http.StatusForbidden)
//			return
//		}
//		fmt.Println(claims)
//
//		username, usernameok := claims["username"].(string)
//		firstName, firstOk := claims["firstName"].(string)
//		lastName, lastok := claims["lastName"].(string)
//		email, emailok := claims["email"].(string)
//		floatId, idok := claims["UserId"].(float64)
//
//		roomId, roomIdOk := claims["room_id"]
//		description, descriptionOk := claims["room_id"]
//		limit, limitOk := claims["room_id"]
//		roomName, roomNameOk := claims["room_id"]
//		OwnerName, OwnerNameOk := claims["room_id"]
//		validCreds := []bool{
//			usernameok,
//			firstOk,
//			lastok,
//			emailok,
//			idok,
//			roomIdOk,
//			descriptionOk,
//			limitOk,
//			roomIdOk,
//			roomNameOk,
//			OwnerNameOk,
//		}
//		if result := CheckClaims(validCreds); !result {
//			http.Error(w, "AUTHENTICATION FAILED", http.StatusForbidden)
//			log.Println("token is empty")
//			return
//
//		}
//		RoomContext := &dtos.UserJwt{
//			RegisterUser: dtos.RegisterUser{
//				Username:  username,
//				FirstName: firstName,
//				LastName:  lastName,
//				Email:     email,
//			}, UserId: int(floatId),
//		}
//		cntxt := context.WithValue(r.Context(), dtos.UserContext, userContext)
//		next.ServeHTTP(w, r.WithContext(cntxt))
//		return
//
//	})
//
//}
