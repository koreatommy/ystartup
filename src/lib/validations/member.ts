import { SCHOOLS, SCHOOL_TYPES, GRADES, type SchoolType } from "@/constants/member";

const PHONE_REGEX = /^\d{3}-\d{4}-\d{4}$/;
/** Trimmed local@domain.tld — TLD at least 2 chars, no whitespace. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Korean mobile-style display: digits only, max 11, formatted as XXX-XXXX-XXXX. */
export function formatKoreanMobileHyphenInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export interface ValidationError {
  field: string;
  message: string;
}

function validateCommon(
  data: { name?: string; phone?: string; email?: string },
  errors: ValidationError[],
) {
  if (!data.name?.trim()) {
    errors.push({ field: "name", message: "이름은 필수 항목입니다." });
  }
  const phone = data.phone?.trim() ?? "";
  if (!phone) {
    errors.push({ field: "phone", message: "연락처는 필수 항목입니다." });
  } else if (!PHONE_REGEX.test(phone)) {
    errors.push({ field: "phone", message: "연락처는 000-0000-0000 형식이어야 합니다." });
  }
  const email = data.email?.trim() ?? "";
  if (!email) {
    errors.push({ field: "email", message: "이메일은 필수 항목입니다." });
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push({ field: "email", message: "유효한 이메일 형식이 아닙니다." });
  }
}

export function validateStudentSignup(data: {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  school_type?: string;
  school_name?: string;
  grade?: string;
  coach_id?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  validateCommon(data, errors);

  if (!data.password || data.password.length < 6) {
    errors.push({ field: "password", message: "비밀번호는 6자 이상이어야 합니다." });
  }

  if (!data.school_type) {
    errors.push({ field: "school_type", message: "학교 유형을 선택해주세요." });
  } else if (!SCHOOL_TYPES.includes(data.school_type as SchoolType)) {
    errors.push({ field: "school_type", message: "유효하지 않은 학교 유형입니다." });
  }

  if (!data.school_name) {
    errors.push({ field: "school_name", message: "학교를 선택해주세요." });
  } else if (
    data.school_type &&
    SCHOOL_TYPES.includes(data.school_type as SchoolType) &&
    !SCHOOLS[data.school_type as SchoolType].includes(data.school_name)
  ) {
    errors.push({ field: "school_name", message: "유효하지 않은 학교입니다." });
  }

  if (!data.grade) {
    errors.push({ field: "grade", message: "학년을 선택해주세요." });
  } else if (!(GRADES as readonly string[]).includes(data.grade)) {
    errors.push({ field: "grade", message: "유효하지 않은 학년입니다." });
  }

  if (!data.coach_id) {
    errors.push({ field: "coach_id", message: "담당 코치를 선택해주세요." });
  }

  return errors;
}

export function validateCoachSignup(data: {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  affiliation?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  validateCommon(data, errors);

  if (!data.password || data.password.length < 6) {
    errors.push({ field: "password", message: "비밀번호는 6자 이상이어야 합니다." });
  }

  if (!data.affiliation?.trim()) {
    errors.push({ field: "affiliation", message: "소속은 필수 항목입니다." });
  }

  return errors;
}

export function validateProfileUpdate(
  data: { phone?: string; email?: string; affiliation?: string },
  role: string,
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.phone !== undefined) {
    const phone = data.phone.trim();
    if (!phone) {
      errors.push({ field: "phone", message: "연락처는 필수 항목입니다." });
    } else if (!PHONE_REGEX.test(phone)) {
      errors.push({ field: "phone", message: "연락처는 000-0000-0000 형식이어야 합니다." });
    }
  }

  if (data.email !== undefined) {
    const email = data.email.trim();
    if (!email) {
      errors.push({ field: "email", message: "이메일은 필수 항목입니다." });
    } else if (!EMAIL_REGEX.test(email)) {
      errors.push({ field: "email", message: "유효한 이메일 형식이 아닙니다." });
    }
  }

  if (role === "coach" && data.affiliation !== undefined && !data.affiliation.trim()) {
    errors.push({ field: "affiliation", message: "소속은 필수 항목입니다." });
  }

  return errors;
}
