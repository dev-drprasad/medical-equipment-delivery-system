package operations

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

type aggregated struct {
	ServiceDate string `db:"serviceDate" json:"serviceDate"`
	Count       uint64 `db:"count" json:"count"`
}

func GetOrderStatusAggregations(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		status := params["status"]
		if status == "" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		res := []aggregated{}
		err := db.Select(&res, "SELECT serviceDate, COUNT(id) as count FROM `order` WHERE serviceDate >= (CURDATE() - INTERVAL 1 MONTH) AND serviceDate <= CURDATE() AND status = ? GROUP BY serviceDate", status)
		if err != nil {
			log.Println("Could not aggregate on ", status, " : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		log.Println(res)

		b, err := json.Marshal(res)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.Write(b)
	})
}
