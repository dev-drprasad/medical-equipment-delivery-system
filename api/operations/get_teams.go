package operations

import (
	"encoding/json"
	"log"
	"net/http"

	"breath-right-one/api/models"

	"github.com/jmoiron/sqlx"
)

func GetTeams(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		var teams []models.Team
		err := db.Select(&teams, "SELECT * FROM team")
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		tts := []models.Team{}
		for _, t := range teams {
			t := models.Team{
				ID:   t.ID,
				Name: t.Name,
				Role: &models.Role{ID: t.RoleID, Name: models.RolesValueToName[t.RoleID]},
			}
			tts = append(tts, t)
		}

		b, err := json.Marshal(tts)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.Write(b)
	})
}
