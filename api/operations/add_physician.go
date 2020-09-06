package operations

import (
	"encoding/json"
	"net/http"

	"breath-right-one/api/models"

	"github.com/jmoiron/sqlx"
)

func AddPhysician(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		dec := json.NewDecoder(r.Body)
		var p models.Physician
		if err := dec.Decode(&p); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		result, err := db.Exec(`INSERT INTO physician(name, address, city, zipcode, phoneNumber) 
					VALUES(?, ?, ?, ?, ?)`, &p.Name, &p.Address, &p.City, &p.Zipcode, &p.PhoneNumber)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		rowsAffected, _ := result.RowsAffected()
		if rowsAffected != 1 {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Add("Content-Type", "application/json")
		w.Write([]byte("{}"))
	})
}
