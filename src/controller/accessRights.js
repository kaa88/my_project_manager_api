export const USER_ROLES = {
  GUEST: "GUEST",
  USER: "USER",
  ADMIN: "ADMIN",
};

const roleOrder = [USER_ROLES.GUEST, USER_ROLES.USER, USER_ROLES.ADMIN];

export const isCorrectUserRole = (requiredRole = "", requestRole = "") => {
  const requiredRoleIndex = roleOrder.indexOf(requiredRole.toUpperCase());
  const requestRoleIndex = roleOrder.indexOf(requestRole.toUpperCase());
  if (requiredRoleIndex === -1 || requestRoleIndex === -1) {
    console.error("Incorrect user role value(s)");
    return false;
  }
  return requestRoleIndex >= requiredRoleIndex;
};
