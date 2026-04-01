import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ROOT_HUNTER_PREVIEW = "/images/games/roothunter.png";
const SCAMPER_PREVIEW = "/images/games/scamper.png";

const GAME_STRUCTURE = [
  "Why 1 — 가지 1: 증상",
  "Why 2 — 가지 2: 직접 원인",
  "Why 3 — 줄기: 행동 원인",
  "Why 4 — 뿌리 1: 시스템 원인",
  "Why 5 — 뿌리 2: 근본 원인",
] as const;

const SCAMPER_STRUCTURE = [
  "S — Substitute: 대체",
  "C — Combine: 결합",
  "A — Adapt: 적용",
  "M — Modify: 수정",
  "P — Put to another use: 다른 용도",
  "E — Eliminate: 제거",
  "R — Reverse: 거꾸로",
] as const;

export function LearningGamesIntro() {
  return (
    <section className="glass rounded-2xl p-6 md:p-8">
      <h2 className="font-sidebar text-lg font-semibold text-[var(--color-text)]">
        학습용 온라인 게임 소개
      </h2>
      <div className="mt-2 max-w-3xl space-y-3">
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          워크북 활동과 연계된 브라우저 게임으로, 수업 중에도 바로 체험할 수 있습니다.
        </p>
        <p className="m-0">
          <span
            className="inline-flex items-center rounded-xl border border-white/15 bg-gradient-to-br from-[var(--gradient-primary-start)] to-[var(--gradient-primary-end)] px-4 py-2.5 font-sidebar text-sm font-semibold text-white shadow-[0_4px_14px_rgba(99,102,241,0.45)]"
            role="note"
          >
            학습용 게임은 계속 업데이트됩니다.
          </span>
        </p>
      </div>

      <article className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        <div className="relative w-full shrink-0 overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] lg:max-w-md lg:basis-[42%]">
          <div className="relative aspect-[3/4] w-full">
            <div className="absolute inset-3 sm:inset-4">
              <Image
                src={ROOT_HUNTER_PREVIEW}
                alt="뿌리를 찾아라(Root Hunter): 5 Whys를 나무 구조로 시각화하는 학습 게임 화면 예시"
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 400px"
                priority={false}
              />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div>
            <p className="font-main text-xs font-medium uppercase tracking-wide text-[var(--color-primary)]">
              WB2-② 5 Whys 문제 분석하기
            </p>
            <p className="mt-0.5 font-main text-xs text-[var(--color-text-muted)]">
              Analyzing problems using the 5 Whys technique
            </p>
            <h3 className="mt-2 font-sidebar text-xl font-semibold text-[var(--color-text)]">
              뿌리를 찾아라 (Root Hunter)
            </h3>
          </div>

          <div>
            <h4 className="font-sidebar text-sm font-semibold text-[var(--color-text)]">
              게임 목표
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              겉으로 보이는 문제(증상)에서 출발해, 다섯 번의 &apos;왜?&apos;를 통해
              행동·시스템 차원의 원인까지 스스로 도달해 보세요. 나무가 자라듯 단계가
              쌓이며 근본 원인을 구조적으로 이해할 수 있습니다.
            </p>
          </div>

          <div>
            <h4 className="font-sidebar text-sm font-semibold text-[var(--color-text)]">
              게임 구조
            </h4>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              5 Whys를 나무 구조로 시각화합니다.
            </p>
            <ul className="mt-2 space-y-1 font-main text-sm text-[var(--color-text-secondary)]">
              {GAME_STRUCTURE.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-[var(--color-primary)]" aria-hidden>
                    •
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            <p>
              <span className="font-semibold text-[var(--color-text)]">주요 기능: </span>
              실시간 나무 성장, 시나리오 3종, 오답 피드백·점수, 팀 협동 모드, 결과
              화면에서 근본 원인·해결 방향·토론 팁을 확인할 수 있습니다.
            </p>
            <p>
              <span className="font-semibold text-[var(--color-text)]">교실 활용: </span>
              팀원이 Why를 나눠 맡은 뒤, 완료 후 &quot;우리 학교에서 이 뿌리를 어떻게
              고칠까?&quot; 토론으로 이어가 보세요.
            </p>
          </div>

          <Link
            href="/root-hunter"
            className="group mt-auto inline-flex w-fit rounded-xl btn-gradient px-5 py-2.5 font-sidebar text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
          >
            <span className="inline-flex items-center gap-2">
              게임 하러 가기
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </article>

      <article className="mt-10 flex flex-col gap-6 border-t border-[var(--glass-border)] pt-10 lg:flex-row lg:items-stretch lg:gap-8">
        <div className="relative w-full shrink-0 overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] lg:max-w-md lg:basis-[42%]">
          <div className="relative aspect-[3/4] w-full">
            <div className="absolute inset-3 sm:inset-4">
              <Image
                src={SCAMPER_PREVIEW}
                alt="SCAMPER 창의적 사고 게임: 7가지 관점을 배우고 퀴즈·챌린지로 연습하는 화면 예시"
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 400px"
                priority={false}
              />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div>
            <p className="font-main text-xs font-medium uppercase tracking-wide text-[var(--color-primary)]">
              WB4-⑥ 해결방안 개발 및 구체화 (SCAMPER 기법)
            </p>
            <p className="mt-0.5 font-main text-xs text-[var(--color-text-muted)]">
              Solution development (SCAMPER)
            </p>
            <h3 className="mt-2 font-sidebar text-xl font-semibold text-[var(--color-text)]">
              SCAMPER 창의적 사고 게임
            </h3>
          </div>

          <div>
            <h4 className="font-sidebar text-sm font-semibold text-[var(--color-text)]">게임 목표</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              기존 아이디어를 7가지 렌즈로 바꿔 보며 해결안을 넓혀 보세요. 카드로 기법을 익힌 뒤 퀴즈로
              확인하고, 실제 물건·장소를 주제로 아이디어를 적어 갤러리에 모을 수 있습니다.
            </p>
          </div>

          <div>
            <h4 className="font-sidebar text-sm font-semibold text-[var(--color-text)]">7가지 관점</h4>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              SCAMPER 앞 글자마다 하나의 변형 전략이 있습니다.
            </p>
            <ul className="mt-2 space-y-1 font-main text-sm text-[var(--color-text-secondary)]">
              {SCAMPER_STRUCTURE.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-[var(--color-primary)]" aria-hidden>
                    •
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            <p>
              <span className="font-semibold text-[var(--color-text)]">주요 기능: </span>
              기법 배우기(카드 스와이프), 퀴즈(힌트·연속 정답·결과 등급), 창의력 챌린지(주제별 기법
              선택·저장), 나의 아이디어 갤러리 및 초기화까지 한 화면에서 이어집니다.
            </p>
            <p>
              <span className="font-semibold text-[var(--color-text)]">교실 활용: </span>
              워크북의 SCAMPER 활동 전에 게임으로 개념을 익힌 뒤, 팀별로 챌린지 주제를 나눠 발표해
              보세요.
            </p>
          </div>

          <Link
            href="/scamper"
            className="group mt-auto inline-flex w-fit rounded-xl btn-gradient px-5 py-2.5 font-sidebar text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
          >
            <span className="inline-flex items-center gap-2">
              게임 하러 가기
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </article>
    </section>
  );
}
