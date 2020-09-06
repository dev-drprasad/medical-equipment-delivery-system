package operations

import (
	"encoding/json"
	"log"
	"net/http"

	"breath-right-one/api/models"

	"github.com/jmoiron/sqlx"
)

func AddEquipment(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		dec := json.NewDecoder(r.Body)
		var e models.Equipment
		if err := dec.Decode(&e); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		result, err := db.Exec(`INSERT INTO equipment(code, name, setPrice) VALUES(?, ?, ?)`, e.Code, e.Name, e.SetPrice)

		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		rowsAffected, _ := result.RowsAffected()
		if rowsAffected != 1 {
			log.Println("no row affected")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Add("Content-Type", "application/json")
		w.Write([]byte("{}"))
	})
}
