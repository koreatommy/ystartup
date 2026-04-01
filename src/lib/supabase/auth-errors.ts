export function mapSupabaseAuthErrorMessage(message?: string): string {
  if (!message) {
    return "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.";
  }

  const normalized = message.toLowerCase();

  if (normalized.includes("email rate limit exceeded")) {
    return "요청이 많아 회원가입이 잠시 제한되었습니다. 1~2분 뒤 다시 시도해주세요.";
  }

  if (normalized.includes("already registered") || normalized.includes("user already registered")) {
    return "이미 가입된 이메일입니다. 로그인 또는 비밀번호 찾기를 이용해주세요.";
  }

  if (normalized.includes("invalid email")) {
    return "이메일 형식이 올바르지 않습니다.";
  }

  return message;
}
