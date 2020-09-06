package models

type Team struct {
	ID     uint64 `json:"id" db:"id"`
	Name   string `json:"name" db:"name"`
	RoleID RoleID `db:"role" json:"roleId"`

	Role *Role `db:"-" json:"role"`
}
