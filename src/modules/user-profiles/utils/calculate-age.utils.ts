export const calculateAge = (birthDate: string): number => {
  const birthDateinDate: Date = new Date(birthDate);
  const today: Date = new Date();

  const birthYear: number = birthDateinDate.getUTCFullYear();
  const birthMonth: number = birthDateinDate.getUTCMonth();
  const birthDay: number = birthDateinDate.getUTCDate();

  const currentYear: number = today.getUTCFullYear();
  const currentMonth: number = today.getUTCMonth();
  const currentDay: number = today.getUTCDate();

  let age = currentYear - birthYear;

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
};
