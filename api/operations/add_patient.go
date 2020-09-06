package operations

import (
	"encoding/json"
	"log"
	"net/http"

	"breath-right-one/api/models"

	"github.com/jmoiron/sqlx"
)

type PatientBody struct {
	models.Patient
	InsuredBy uint64 `json:"insuredBy" db:"insuredById"`
}

func AddPatient(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		dec := json.NewDecoder(r.Body)
		var p PatientBody
		if err := dec.Decode(&p); err != nil {
			log.Println("Invalid post body", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		result, err := db.NamedExec(`INSERT INTO patient(accountId, firstName, lastName, phoneNumber, address, zipcode, birthDate, insuredBy) 
					VALUES(:accountId, :firstName, :lastName, :phoneNumber, :address, :zipcode, :birthDate, :insuredById)`, p)

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
