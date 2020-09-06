package models

type RoleID string

const (
	RoleSales    RoleID = "Sales"
	RoleDTech    RoleID = "DTech"
	RoleAdmin    RoleID = "Admin"
	RoleScreener RoleID = "Screener"
)

type Role struct {
	ID   RoleID `json:"id"`
	Name string `json:"name"`
}

var RolesValueToName = map[RoleID]string{RoleSales: "Sales", RoleDTech: "Delivery Tech", RoleAdmin: "Administrator", RoleScreener: "Screener"}
var RolesNameToValue = map[string]RoleID{"Sales": RoleSales, "Delivery Tech": RoleDTech, "Administrator": RoleAdmin, "Screener": RoleScreener}
