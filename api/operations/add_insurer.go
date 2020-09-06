package operations

import (
	"encoding/json"
	"net/http"

	"breath-right-one/api/models"

	"github.com/jmoiron/sqlx"
)

func AddInsurer(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		dec := json.NewDecoder(r.Body)
		var i models.Insurer
		if err := dec.Decode(&i); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		result, err := db.NamedExec(`INSERT INTO insurer(name, address, city, zipcode, phoneNumber) 
					VALUES(:name, :address, :city, :zipcode, :phoneNumber)`, i)

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
