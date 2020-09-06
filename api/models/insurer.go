package models

type Insurer struct {
	ID          uint64 `json:"id" db:"id"`
	Name        string `json:"name" db:"name"`
	Address     string `json:"address,omitempty" db:"address"`
	City        string `json:"city,omitempty" db:"city"`
	Zipcode     string `json:"zipcode,omitempty" db:"zipcode"`
	PhoneNumber string `json:"phoneNumber,omitempty" db:"phoneNumber"`

	// https://github.com/go-sql-driver/mysql/issues/34#issuecomment-248543900
}
