package operations

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/jmoiron/sqlx"
)

type patientsAggregated struct {
	CreatedAt string `db:"createdAt" json:"createdAt"`
	Count     uint64 `db:"count" json:"count"`
}

func GetNewPatientsAggregated(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		res := []patientsAggregated{}
		err := db.Select(&res, "SELECT DATE(createdAt) AS createdAt, COUNT(accountId) AS count FROM patient GROUP BY DATE(createdAt)")
		if err != nil {
			log.Println("Could not aggregated users ", " : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		b, err := json.Marshal(res)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.Write(b)
	})
}
