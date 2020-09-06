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

func GetOrderDocuments(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		idStr := params["id"]
		id, err := strconv.ParseUint(idStr, 10, 64)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		documents := []models.Document{}
		err = db.Select(&documents, "select document.id, document.name, (UNIX_TIMESTAMP(document.createdAt)*1000) as createdAt, document.path from `document` JOIN `order` ON `order`.id = `document`.orderId WHERE `order`.id = ?", id)
		if err != nil {
			log.Println("Could not query documents ", id, " : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		b, err := json.Marshal(documents)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.Write(b)
	})
}
