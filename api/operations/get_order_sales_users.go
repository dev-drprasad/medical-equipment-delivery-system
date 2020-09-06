package operations

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"breath-right-one/api/models"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

func GetOrderSalesUsers(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		idStr := params["id"]
		id, err := strconv.ParseUint(idStr, 10, 64)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		users := []models.User{}
		err = db.Select(&users, "select user.id, user.name from `user` JOIN order_sale_user ON order_sale_user.userId = user.id JOIN `order` ON `order`.id = order_sale_user.orderId WHERE `order`.id = ?", id)
		if err != nil {
			log.Println("Could not query users ", id, " : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		b, err := json.Marshal(users)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.Write(b)
	})
}
