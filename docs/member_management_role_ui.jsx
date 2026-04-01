import { useMemo, useState } from "react";

export default function MemberManagementRoleUI() {
  const schoolOptions = {
    중학교: ['영월중학교', '봉래중학교', '옥동중학교', '녹전중학교', '마차중학교', '연당중학교', '쌍룡중학교', '주천중학교', '상동중학교', '석정여자중학교'],
    고등학교: ['영월고등학교', '한국소방마이스터고등학교', '마차고등학교', '주천고등학교', '상동고등학교', '석정여자고등학교'],
  };

  const adminMenu = [
    { section: '대시보드', items: ['운영 현황', '승인 대기 현황', '최근 가입자'] },
    { section: '회원관리', items: ['전체 회원 목록', '코치 목록', '학생 목록', '회원 상세 조회'] },
    { section: '승인·배정관리', items: ['코치 승인 관리', '학생-코치 배정 관리', '학교별 배정 현황'] },
    { section: '기준정보', items: ['학교 목록 관리', '상태값 관리'] },
    { section: '설정', items: ['내 정보', '권한 정책 확인'] },
  ];

  const coachMenu = [
    { section: '대시보드', items: ['내 정보 요약', '담당 학생 현황', '최근 등록 학생'] },
    { section: '학생관리', items: ['담당 학생 목록', '학생 상세 조회'] },
    { section: '설정', items: ['내 정보 조회', '내 정보 수정'] },
  ];

  const studentMenu = [
    { section: '대시보드', items: ['내 정보 요약', '담당 코치 정보', '계정 상태'] },
    { section: '내 정보', items: ['내 정보 조회', '연락처/이메일 수정'] },
  ];

  const [adminSelected, setAdminSelected] = useState('운영 현황');
  const [coachSelected, setCoachSelected] = useState('내 정보 요약');
  const [studentSelected, setStudentSelected] = useState('내 정보 요약');

  const Sidebar = ({ title, role, menu, selected, onSelect }) => (
    <aside className="w-72 rounded-3xl border border-white/10 bg-[#111322] p-5 shadow-2xl">
      <div className="mb-6">
        <div className="text-xs text-violet-300">Y-START</div>
        <div className="mt-1 text-xl font-semibold text-white">{title}</div>
        <div className="mt-1 text-sm text-slate-400">로그인 역할: {role}</div>
      </div>
      <nav className="space-y-5">
        {menu.map((group) => (
          <div key={group.section}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{group.section}</div>
            <div className="space-y-2">
              {group.items.map((item) => {
                const isActive = selected === item;
                return (
                  <button
                    key={item}
                    onClick={() => onSelect(item)}
                    className={`w-full rounded-2xl px-3 py-2 text-left text-sm transition ${isActive ? 'border border-violet-400/30 bg-violet-500/20 text-violet-200' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );

  const StatCard = ({ label, value, hint }) => (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-3 text-3xl font-bold text-white">{value}</div>
      <div className="mt-2 text-sm text-slate-500">{hint}</div>
    </div>
  );

  const TableCard = ({ title, headers, rows, actions }) => (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {actions ? <div className="flex gap-2">{actions}</div> : null}
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-white/10 text-slate-200">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const InfoCard = ({ title, rows, actionLabel }) => (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {actionLabel ? <button className="rounded-2xl bg-violet-500 px-4 py-2 text-sm font-medium text-white">{actionLabel}</button> : null}
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-sm text-slate-400">{row.label}</div>
            <div className="text-sm font-medium text-white">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const FormCard = ({ title, fields, submitLabel }) => (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button className="rounded-2xl bg-violet-500 px-4 py-2 text-sm font-medium text-white">{submitLabel}</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.label} className="block">
            <div className="mb-2 text-sm text-slate-400">{field.label}</div>
            <input
              defaultValue={field.value}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${field.disabled ? 'border-white/5 bg-white/5 text-slate-500' : 'border-white/10 bg-[#0f1220] text-white focus:border-violet-400/50'}`}
            />
          </label>
        ))}
      </div>
    </div>
  );

  const InputField = ({ label, placeholder, value, disabled = false }) => (
    <label className="block">
      <div className="mb-2 text-sm text-slate-400">{label}</div>
      <input
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${disabled ? 'border-white/5 bg-white/5 text-slate-500' : 'border-white/10 bg-[#0f1220] text-white focus:border-violet-400/50'}`}
      />
    </label>
  );

  const SelectField = ({ label, options, value, disabled = false }) => (
    <label className="block">
      <div className="mb-2 text-sm text-slate-400">{label}</div>
      <select
        defaultValue={value}
        disabled={disabled}
        className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${disabled ? 'border-white/5 bg-white/5 text-slate-500' : 'border-white/10 bg-[#0f1220] text-white focus:border-violet-400/50'}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );

  const SectionHeader = ({ badge, title, description, selected }) => (
    <div className="rounded-[28px] border border-white/10 bg-gradient-to-r from-[#1a1d31] to-[#17192a] p-6 shadow-2xl">
      <div className="text-sm font-medium text-violet-300">{badge}</div>
      <h2 className="mt-2 text-3xl font-bold text-white">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{description}</p>
      <div className="mt-4 inline-flex rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
        현재 선택 메뉴: {selected}
      </div>
    </div>
  );

  const renderAdminContent = useMemo(() => {
    const commonActions = [
      <button key="a" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">엑셀 다운로드</button>,
      <button key="b" className="rounded-2xl bg-violet-500 px-4 py-2 text-sm font-medium text-white">신규 등록</button>,
    ];

    const map = {
      '운영 현황': {
        stats: [
          { label: '전체 회원', value: '284', hint: '학생 241 / 코치 38 / 관리자 5' },
          { label: '승인 대기 코치', value: '6', hint: '즉시 검토 필요' },
          { label: '비활성 계정', value: '12', hint: 'inactive 상태 회원' },
          { label: '학교 수', value: '16', hint: '중학교 10 / 고등학교 6' },
        ],
        left: <TableCard title="최근 가입자" headers={['이름', '역할', '학교/소속', '상태']} rows={[["최민서", "student", "영월고등학교", "approved"], ["박서연", "coach", "영월진로센터", "pending"], ["정하윤", "student", "봉래중학교", "approved"]]} actions={commonActions} />,
        right: <InfoCard title="운영 요약" rows={[{ label: '학생-코치 배정 완료율', value: '100%' }, { label: '승인 대기 코치', value: '6명' }, { label: '최근 비활성 처리', value: '2건' }, { label: '학교 등록 현황', value: '16개교' }]} />,
      },
      '승인 대기 현황': {
        stats: [
          { label: '대기 중', value: '6', hint: '코치 신청' },
          { label: '오늘 승인', value: '2', hint: '당일 처리' },
          { label: '오늘 반려', value: '1', hint: '정보 불충분' },
          { label: '평균 처리시간', value: '4h', hint: '최근 7일' },
        ],
        left: <TableCard title="코치 승인 대기 목록" headers={['이름', '소속', '연락처', '상태']} rows={[["김지훈", "영월진로센터", "010-1234-1111", "pending"], ["박서연", "창업교육지원단", "010-1234-2222", "pending"], ["이도현", "청소년지원센터", "010-1234-3333", "pending"]]} actions={[<button key="1" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">일괄 반려</button>, <button key="2" className="rounded-2xl bg-violet-500 px-4 py-2 text-sm font-medium text-white">일괄 승인</button>]} />,
        right: <InfoCard title="처리 안내" rows={[{ label: '승인 기준', value: '소속·연락처·이메일 확인' }, { label: '반려 사유 예시', value: '중복 신청 / 정보 누락' }, { label: '상태값', value: 'pending / approved / rejected' }]} />,
      },
      '최근 가입자': {
        stats: [
          { label: '오늘 가입', value: '9', hint: '전체 기준' },
          { label: '학생 가입', value: '7', hint: '즉시 approved' },
          { label: '코치 가입', value: '2', hint: 'pending 처리' },
          { label: '중복 검토', value: '1', hint: '이메일 확인 필요' },
        ],
        left: <TableCard title="최근 가입자 목록" headers={['가입일', '이름', '역할', '이메일']} rows={[["2026-03-30", "최민서", "student", "student01@example.com"], ["2026-03-30", "박서연", "coach", "coach02@example.com"], ["2026-03-29", "정하윤", "student", "student02@example.com"]]} />,
        right: <InfoCard title="가입 검토 포인트" rows={[{ label: '학생 필수값', value: '학교 / 학년 / 담당 코치' }, { label: '코치 필수값', value: '소속 / 연락처 / 이메일' }, { label: '중복 확인', value: '이메일 기준 검토' }]} />,
      },
      '전체 회원 목록': {
        stats: [
          { label: '전체 회원', value: '284', hint: '관리 대상 전체' },
          { label: 'approved', value: '266', hint: '정상 이용 가능' },
          { label: 'pending', value: '6', hint: '승인 필요' },
          { label: 'inactive', value: '12', hint: '로그인 불가' },
        ],
        left: <TableCard title="전체 회원 목록" headers={['이름', '역할', '학교/소속', '상태']} rows={[["최민서", "student", "영월고등학교", "approved"], ["박서연", "coach", "영월진로센터", "approved"], ["관리자A", "super_admin", "본부", "approved"], ["김지훈", "coach", "창업교육지원단", "pending"]]} actions={commonActions} />,
        right: <InfoCard title="조회 필터" rows={[{ label: '역할', value: 'super_admin / coach / student' }, { label: '상태', value: 'pending / approved / rejected / inactive' }, { label: '검색', value: '이름 / 이메일 / 연락처' }]} />,
      },
      '코치 목록': {
        stats: [
          { label: '전체 코치', value: '38', hint: '등록 코치' },
          { label: 'approved 코치', value: '30', hint: '학생 선택 가능' },
          { label: 'pending 코치', value: '6', hint: '승인 필요' },
          { label: 'inactive 코치', value: '2', hint: '비활성 처리' },
        ],
        left: <TableCard title="코치 목록" headers={['이름', '소속', '이메일', '상태']} rows={[["박서연", "영월진로센터", "coach02@example.com", "approved"], ["김지훈", "창업교육지원단", "coach03@example.com", "pending"], ["이도현", "청소년지원센터", "coach04@example.com", "approved"]]} />,
        right: <InfoCard title="운영 규칙" rows={[{ label: '학생 선택 가능 조건', value: 'approved 코치만 가능' }, { label: '수정 가능 항목', value: '소속 / 연락처 / 이메일' }, { label: '관리자 권한', value: '승인 / 반려 / 비활성화' }]} />,
      },
      '학생 목록': {
        stats: [
          { label: '전체 학생', value: '241', hint: '등록 학생' },
          { label: '중학생', value: '114', hint: 'school_type = 중학교' },
          { label: '고등학생', value: '127', hint: 'school_type = 고등학교' },
          { label: '배정 완료', value: '241', hint: 'coach_id 연결 완료' },
        ],
        left: <TableCard title="학생 목록" headers={['이름', '학교', '학년', '담당 코치']} rows={[["최민서", "영월고등학교", "2학년", "박서연"], ["정하윤", "봉래중학교", "3학년", "박서연"], ["윤지후", "주천고등학교", "1학년", "이도현"]]} />,
        right: <InfoCard title="운영 규칙" rows={[{ label: '기본 상태', value: 'approved' }, { label: '필수 입력', value: '학교 / 학년 / 담당 코치' }, { label: '학생 직접 수정 가능', value: '연락처 / 이메일만 가능' }]} />,
      },
      '회원 상세 조회': {
        stats: [
          { label: '선택 회원', value: '최민서', hint: 'student 계정' },
          { label: '상태', value: 'approved', hint: '정상 이용 가능' },
          { label: '학교', value: '영월고등학교', hint: '2학년' },
          { label: '담당 코치', value: '박서연', hint: 'coach_id 연결' },
        ],
        left: <InfoCard title="회원 상세 정보" rows={[{ label: '이름', value: '최민서' }, { label: '역할', value: 'student' }, { label: '연락처', value: '010-9876-5432' }, { label: '이메일', value: 'student01@example.com' }, { label: '학교유형', value: '고등학교' }, { label: '학교명', value: '영월고등학교' }, { label: '학년', value: '2학년' }, { label: '담당 코치', value: '박서연' }]} actionLabel="회원 수정" />,
        right: <InfoCard title="관리 작업" rows={[{ label: '가능 작업', value: '상태 변경 / 코치 변경 / 학교·학년 수정' }, { label: '삭제 정책', value: '하드 삭제보다 inactive 우선' }, { label: '감사 로그', value: '변경 이력 기록 필요' }]} />,
      },
      '코치 승인 관리': {
        stats: [
          { label: '승인 대기', value: '6', hint: '처리 필요' },
          { label: '승인 완료', value: '30', hint: '학생 선택 가능' },
          { label: '반려 완료', value: '2', hint: '재신청 가능' },
          { label: '오늘 처리', value: '3', hint: '당일 기준' },
        ],
        left: <TableCard title="승인 처리 화면" headers={['이름', '소속', '이메일', '처리']} rows={[["김지훈", "영월진로센터", "coach01@example.com", "승인/반려"], ["박서연", "창업교육지원단", "coach02@example.com", "승인/반려"], ["이도현", "청소년지원센터", "coach03@example.com", "승인/반려"]]} />,
        right: <InfoCard title="상태 전환 규칙" rows={[{ label: '가입 직후', value: 'pending' }, { label: '승인 시', value: 'approved' }, { label: '반려 시', value: 'rejected' }, { label: '로그인 제한', value: 'inactive' }]} />,
      },
      '학생-코치 배정 관리': {
        stats: [
          { label: '배정 학생', value: '241', hint: '전체 학생' },
          { label: '배정 가능 코치', value: '30', hint: 'approved 코치' },
          { label: '배정 변경 요청', value: '4', hint: '관리자 처리' },
          { label: '미배정 학생', value: '0', hint: '현재 없음' },
        ],
        left: <TableCard title="배정 관리" headers={['학생', '현재 코치', '학교', '변경']} rows={[["최민서", "박서연", "영월고등학교", "변경"], ["정하윤", "박서연", "봉래중학교", "변경"], ["윤지후", "이도현", "주천고등학교", "변경"]]} />,
        right: <InfoCard title="배정 규칙" rows={[{ label: '학생 당 코치 수', value: '1명' }, { label: '코치 당 학생 수', value: '다수 가능' }, { label: '변경 권한', value: 'super_admin만 가능' }]} />,
      },
      '학교별 배정 현황': {
        stats: [
          { label: '학교 수', value: '16', hint: '등록 학교' },
          { label: '중학교', value: '10', hint: '고정 목록' },
          { label: '고등학교', value: '6', hint: '고정 목록' },
          { label: '코치 배정 검토', value: '2건', hint: '학교별 편차 점검' },
        ],
        left: <TableCard title="학교별 배정 현황" headers={['학교명', '유형', '학생 수', '배정 코치']} rows={[["영월중학교", "중학교", "32", "박서연"], ["봉래중학교", "중학교", "24", "박서연"], ["영월고등학교", "고등학교", "41", "이도현"]]} />,
        right: <InfoCard title="학교 운영 포인트" rows={[{ label: '학교 목록 변경', value: 'super_admin만 가능' }, { label: '학생 가입 시 사용', value: '선택형 목록' }, { label: '확장 방식', value: '상수 + 관리 화면 병행' }]} />,
      },
      '학교 목록 관리': {
        stats: [
          { label: '전체 학교', value: '16', hint: '현재 등록' },
          { label: '중학교', value: '10', hint: '영월 관내' },
          { label: '고등학교', value: '6', hint: '영월 관내' },
          { label: '최근 변경', value: '0건', hint: '최근 30일' },
        ],
        left: <TableCard title="학교 목록" headers={['학교명', '유형', '상태']} rows={[["영월중학교", "중학교", "사용 중"], ["봉래중학교", "중학교", "사용 중"], ["영월고등학교", "고등학교", "사용 중"], ["주천고등학교", "고등학교", "사용 중"]]} actions={commonActions} />,
        right: <FormCard title="학교 등록/수정" submitLabel="저장" fields={[{ label: '학교 유형', value: '중학교' }, { label: '학교명', value: '새 학교명 입력' }]} />,
      },
      '상태값 관리': {
        stats: [
          { label: '사용 상태값', value: '4', hint: '고정 enum' },
          { label: 'pending', value: '6', hint: '승인 대기' },
          { label: 'approved', value: '266', hint: '정상 이용' },
          { label: 'inactive', value: '12', hint: '로그인 제한' },
        ],
        left: <TableCard title="상태값 정의" headers={['상태값', '의미', '로그인 가능']} rows={[["pending", "가입대기", "불가"], ["approved", "승인", "가능"], ["rejected", "반려", "불가"], ["inactive", "비활성", "불가"]]} />,
        right: <InfoCard title="운영 원칙" rows={[{ label: 'coach 기본값', value: 'pending' }, { label: 'student 기본값', value: 'approved' }, { label: '삭제 대체', value: 'inactive 우선' }]} />,
      },
      '내 정보': {
        stats: [
          { label: '역할', value: 'super_admin', hint: '최고 관리자' },
          { label: '상태', value: 'approved', hint: '정상 이용 가능' },
          { label: '권한 범위', value: '전체 관리', hint: '회원 / 학교 / 배정' },
          { label: '최근 로그인', value: '오늘 09:10', hint: '관리자 계정' },
        ],
        left: <FormCard title="내 정보 수정" submitLabel="저장" fields={[{ label: '이름', value: '관리자A' }, { label: '소속', value: '본부' }, { label: '연락처', value: '010-1111-2222' }, { label: '이메일', value: 'admin@example.com' }]} />,
        right: <InfoCard title="관리 권한 요약" rows={[{ label: '조회 가능', value: '전체 회원' }, { label: '수정 가능', value: '전체 회원 / 학교 / 배정' }, { label: '승인 처리', value: '코치 승인 / 반려' }]} />,
      },
      '권한 정책 확인': {
        stats: [
          { label: '역할 수', value: '3', hint: 'super_admin / coach / student' },
          { label: '상태값 수', value: '4', hint: 'pending 등' },
          { label: 'RLS 정책', value: '적용', hint: 'DB 레벨 권한 통제' },
          { label: 'RBAC', value: '적용', hint: '앱 레벨 권한 통제' },
        ],
        left: <TableCard title="권한 정책 표" headers={['역할', '조회', '수정']} rows={[["super_admin", "전체 회원", "전체 회원 / 학교 / 배정"], ["coach", "본인 + 담당 학생", "본인 정보만"], ["student", "본인 정보만", "연락처 / 이메일만"]]} />,
        right: <InfoCard title="보안 원칙" rows={[{ label: '프론트 숨김만 사용', value: '불가' }, { label: '서버 검증', value: '필수' }, { label: 'RLS와 서버 일관성', value: '필수' }]} />,
      },
    };

    return map[adminSelected];
  }, [adminSelected]);

  const renderCoachContent = useMemo(() => {
    const map = {
      '내 정보 요약': {
        stats: [
          { label: '이름', value: '박서연', hint: 'coach 계정' },
          { label: '상태', value: 'approved', hint: '정상 이용 가능' },
          { label: '소속', value: '영월진로센터', hint: '수정 가능' },
          { label: '담당 학생 수', value: '18', hint: '현재 배정 기준' },
        ],
        left: <InfoCard title="내 정보 요약" rows={[{ label: '이름', value: '박서연' }, { label: '소속', value: '영월진로센터' }, { label: '연락처', value: '010-1234-5678' }, { label: '이메일', value: 'coach02@example.com' }]} actionLabel="내 정보 수정" />,
        right: <InfoCard title="권한 범위" rows={[{ label: '조회 가능', value: '본인 + 담당 학생' }, { label: '수정 가능', value: '소속 / 연락처 / 이메일' }, { label: '수정 불가', value: '학생 정보 / 상태값' }]} />,
      },
      '담당 학생 현황': {
        stats: [
          { label: '담당 학생', value: '18', hint: '현재 배정' },
          { label: '중학생', value: '8', hint: '중학교 소속' },
          { label: '고등학생', value: '10', hint: '고등학교 소속' },
          { label: '최근 등록', value: '3', hint: '최근 7일' },
        ],
        left: <TableCard title="담당 학생 현황" headers={['이름', '학교', '학년', '상태']} rows={[["최민서", "영월고등학교", "2학년", "approved"], ["정하윤", "봉래중학교", "3학년", "approved"], ["윤지후", "주천고등학교", "1학년", "approved"]]} />,
        right: <InfoCard title="조회 원칙" rows={[{ label: '조회 범위', value: '담당 학생만 가능' }, { label: '상세 조회', value: '가능' }, { label: '학생 수정/삭제', value: '불가' }]} />,
      },
      '최근 등록 학생': {
        stats: [
          { label: '최근 7일', value: '3', hint: '내 담당 학생 기준' },
          { label: '이번 달', value: '6', hint: '내 담당 학생 기준' },
          { label: '최신 등록', value: '최민서', hint: 'student 계정' },
          { label: '조회 가능 범위', value: '담당 학생만', hint: 'RLS 적용' },
        ],
        left: <TableCard title="최근 등록 학생" headers={['등록일', '이름', '학교', '학년']} rows={[["2026-03-30", "최민서", "영월고등학교", "2학년"], ["2026-03-28", "정하윤", "봉래중학교", "3학년"], ["2026-03-24", "윤지후", "주천고등학교", "1학년"]]} />,
        right: <InfoCard title="운영 메모" rows={[{ label: '학생 선택 기준', value: 'approved 코치만 노출' }, { label: '학생 가입 시점', value: '즉시 approved' }, { label: '코치 역할', value: '조회 중심' }]} />,
      },
      '담당 학생 목록': {
        stats: [
          { label: '전체 목록', value: '18', hint: '페이지네이션 가능' },
          { label: '학교 수', value: '5', hint: '담당 학생 분포' },
          { label: '검색', value: '가능', hint: '이름 / 학교' },
          { label: '정렬', value: '가능', hint: '학교 / 학년' },
        ],
        left: <TableCard title="담당 학생 목록" headers={['이름', '학교', '학년', '연락처']} rows={[["최민서", "영월고등학교", "2학년", "010-9876-5432"], ["정하윤", "봉래중학교", "3학년", "010-2222-3333"], ["윤지후", "주천고등학교", "1학년", "010-3333-4444"]]} />,
        right: <InfoCard title="표시 규칙" rows={[{ label: '열람 가능', value: '담당 학생만' }, { label: '표시 항목', value: '학교 / 학년 / 연락처 / 이메일' }, { label: '관리 제한', value: '학생 정보 수정 불가' }]} />,
      },
      '학생 상세 조회': {
        stats: [
          { label: '선택 학생', value: '최민서', hint: '담당 학생' },
          { label: '학교', value: '영월고등학교', hint: '2학년' },
          { label: '계정 상태', value: 'approved', hint: '정상 이용 가능' },
          { label: '담당 코치', value: '박서연', hint: '본인' },
        ],
        left: <InfoCard title="학생 상세 정보" rows={[{ label: '이름', value: '최민서' }, { label: '연락처', value: '010-9876-5432' }, { label: '이메일', value: 'student01@example.com' }, { label: '학교유형', value: '고등학교' }, { label: '학교명', value: '영월고등학교' }, { label: '학년', value: '2학년' }, { label: '담당 코치', value: '박서연' }]} />,
        right: <InfoCard title="조회 제한" rows={[{ label: '조회 조건', value: '본인 담당 학생이어야 함' }, { label: '변경 가능 여부', value: '불가' }, { label: '코치 변경 요청', value: '관리자 처리 대상' }]} />,
      },
      '내 정보 조회': {
        stats: [
          { label: '역할', value: 'coach', hint: '코치 계정' },
          { label: '상태', value: 'approved', hint: '정상 이용 가능' },
          { label: '수정 가능', value: '3개 항목', hint: '소속 / 연락처 / 이메일' },
          { label: '학생 수정', value: '불가', hint: '조회만 가능' },
        ],
        left: <InfoCard title="내 정보" rows={[{ label: '이름', value: '박서연' }, { label: '소속', value: '영월진로센터' }, { label: '연락처', value: '010-1234-5678' }, { label: '이메일', value: 'coach02@example.com' }, { label: '상태', value: 'approved' }]} actionLabel="수정 화면 이동" />,
        right: <InfoCard title="정책 요약" rows={[{ label: 'role 변경', value: '불가' }, { label: 'status 변경', value: '불가' }, { label: '학생 정보 수정', value: '불가' }]} />,
      },
      '내 정보 수정': {
        stats: [
          { label: '수정 가능', value: '소속', hint: 'affiliation' },
          { label: '수정 가능', value: '연락처', hint: 'phone' },
          { label: '수정 가능', value: '이메일', hint: 'email' },
          { label: '수정 불가', value: '이름/역할/상태', hint: '정책 고정' },
        ],
        left: <FormCard title="내 정보 수정" submitLabel="변경 저장" fields={[{ label: '이름', value: '박서연', disabled: true }, { label: '소속', value: '영월진로센터' }, { label: '연락처', value: '010-1234-5678' }, { label: '이메일', value: 'coach02@example.com' }, { label: '역할', value: 'coach', disabled: true }, { label: '상태', value: 'approved', disabled: true }]} />,
        right: <InfoCard title="입력 검증" rows={[{ label: '연락처 형식', value: '000-0000-0000' }, { label: '이메일 형식', value: '유효성 검증 필수' }, { label: '중복 검토', value: '이메일 기준 확인' }]} />,
      },
    };

    return map[coachSelected];
  }, [coachSelected]);

  const renderStudentContent = useMemo(() => {
    const map = {
      '내 정보 요약': {
        stats: [
          { label: '이름', value: '최민서', hint: 'student 계정' },
          { label: '상태', value: 'approved', hint: '정상 이용 가능' },
          { label: '학교', value: '영월고등학교', hint: '직접 변경 불가' },
          { label: '담당 코치', value: '박서연', hint: '직접 변경 불가' },
        ],
        left: <InfoCard title="내 정보 요약" rows={[{ label: '이름', value: '최민서' }, { label: '연락처', value: '010-9876-5432' }, { label: '이메일', value: 'student01@example.com' }, { label: '학교', value: '영월고등학교 / 2학년' }]} actionLabel="내 정보 수정" />,
        right: <InfoCard title="수정 가능 범위" rows={[{ label: '가능', value: '연락처 / 이메일' }, { label: '불가', value: '학교 / 학년 / 담당 코치 / 이름' }, { label: '상태 변경', value: '관리자만 가능' }]} />,
      },
      '담당 코치 정보': {
        stats: [
          { label: '담당 코치', value: '박서연', hint: '현재 배정' },
          { label: '소속', value: '영월진로센터', hint: 'coach affiliation' },
          { label: '연락처', value: '010-1234-5678', hint: '조회용' },
          { label: '변경 권한', value: '없음', hint: 'student 직접 변경 불가' },
        ],
        left: <InfoCard title="담당 코치 정보" rows={[{ label: '이름', value: '박서연' }, { label: '소속', value: '영월진로센터' }, { label: '연락처', value: '010-1234-5678' }, { label: '이메일', value: 'coach02@example.com' }]} />,
        right: <InfoCard title="안내" rows={[{ label: '코치 변경', value: 'super_admin 처리 대상' }, { label: '학생 직접 변경', value: '불가' }, { label: '조회 범위', value: '본인 정보 + 담당 코치' }]} />,
      },
      '계정 상태': {
        stats: [
          { label: '현재 상태', value: 'approved', hint: '정상 로그인 가능' },
          { label: '역할', value: 'student', hint: '고정값' },
          { label: '가입 처리', value: '즉시 승인', hint: 'student 정책' },
          { label: '로그인 제한 상태', value: 'inactive', hint: '관리자 처리 시 제한' },
        ],
        left: <TableCard title="상태값 안내" headers={['상태', '의미', '로그인']} rows={[["approved", "정상 이용 가능", "가능"], ["inactive", "이용 제한", "불가"], ["pending", "student에는 기본 적용 안 함", "불가"], ["rejected", "student에는 일반 적용 안 함", "불가"]]} />,
        right: <InfoCard title="계정 안내" rows={[{ label: '기본 상태', value: 'approved' }, { label: '변경 권한', value: 'super_admin만 가능' }, { label: '비활성화 우선', value: '삭제보다 inactive 적용' }]} />,
      },
      '내 정보 조회': {
        stats: [
          { label: '학교유형', value: '고등학교', hint: 'school_type' },
          { label: '학교명', value: '영월고등학교', hint: 'school_name' },
          { label: '학년', value: '2학년', hint: 'grade' },
          { label: '담당 코치', value: '박서연', hint: 'coach_id 연결' },
        ],
        left: <InfoCard title="내 정보" rows={[{ label: '이름', value: '최민서' }, { label: '연락처', value: '010-9876-5432' }, { label: '이메일', value: 'student01@example.com' }, { label: '학교유형', value: '고등학교' }, { label: '학교명', value: '영월고등학교' }, { label: '학년', value: '2학년' }, { label: '담당 코치', value: '박서연' }, { label: '상태', value: 'approved' }]} />,
        right: <InfoCard title="고정 항목" rows={[{ label: '학교유형', value: '직접 변경 불가' }, { label: '학교명', value: '직접 변경 불가' }, { label: '학년', value: '직접 변경 불가' }, { label: '담당 코치', value: '직접 변경 불가' }]} />,
      },
      '연락처/이메일 수정': {
        stats: [
          { label: '수정 가능', value: '연락처', hint: 'phone' },
          { label: '수정 가능', value: '이메일', hint: 'email' },
          { label: '수정 불가', value: '학교/학년', hint: '정책 제한' },
          { label: '수정 불가', value: '담당 코치', hint: '정책 제한' },
        ],
        left: <FormCard title="내 정보 수정" submitLabel="변경 저장" fields={[{ label: '이름', value: '최민서', disabled: true }, { label: '연락처', value: '010-9876-5432' }, { label: '이메일', value: 'student01@example.com' }, { label: '학교', value: '영월고등학교', disabled: true }, { label: '학년', value: '2학년', disabled: true }, { label: '담당 코치', value: '박서연', disabled: true }]} />,
        right: <InfoCard title="입력 검증" rows={[{ label: '연락처 형식', value: '000-0000-0000' }, { label: '이메일 형식', value: '유효성 검증 필수' }, { label: '저장 제한', value: '허용 항목만 업데이트' }]} />,
      },
    };

    return map[studentSelected];
  }, [studentSelected]);

  const PageShell = ({ badge, title, description, selected, sidebar, stats, mainLeft, mainRight }) => (
    <section className="grid gap-6 xl:grid-cols-[288px_minmax(0,1fr)]">
      {sidebar}
      <div className="space-y-6">
        <SectionHeader badge={badge} title={title} description={description} selected={selected} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label + s.value} {...s} />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          {mainLeft}
          {mainRight}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#090b16] p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-14">
        <section className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-r from-[#1a1d31] to-[#17192a] p-6 shadow-2xl">
            <div className="text-sm font-medium text-violet-300">Public Signup UI</div>
            <h2 className="mt-2 text-3xl font-bold text-white">회원별 가입 폼</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              공개 화면 기준으로 학생 회원가입, 코치 회원가입, 관리자 계정 등록 안내 UI를 분리했습니다. 학생은 학교·학년·담당 코치 선택이 필수이며, 코치는 승인 대기 상태로 가입되도록 안내합니다.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-[#111322] p-5 shadow-2xl">
              <div className="text-xs text-violet-300">Student Signup</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">학생 회원가입</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">가입 즉시 approved 처리되며, 학교·학년·담당 코치 선택은 필수입니다.</p>
              <div className="mt-5 space-y-4">
                <SelectField label="학교 유형" options={['중학교', '고등학교']} value="고등학교" />
                <SelectField label="학교명" options={schoolOptions['고등학교']} value="영월고등학교" />
                <SelectField label="학년" options={['1학년', '2학년', '3학년']} value="2학년" />
                <InputField label="이름" value="최민서" />
                <InputField label="연락처" value="010-9876-5432" placeholder="000-0000-0000" />
                <InputField label="이메일" value="student01@example.com" placeholder="example@email.com" />
                <SelectField label="담당 코치" options={['박서연 | 영월진로센터', '이도현 | 청소년지원센터', '김지훈 | 창업교육지원단']} value="박서연 | 영월진로센터" />
                <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-200">
                  담당 코치 선택 목록에는 approved 상태 코치만 노출됩니다.
                </div>
                <button className="w-full rounded-2xl bg-violet-500 px-4 py-3 text-sm font-medium text-white">학생 회원가입</button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#111322] p-5 shadow-2xl">
              <div className="text-xs text-violet-300">Coach Signup</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">코치 회원가입</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">가입 신청 후 상태는 pending으로 저장되며, 슈퍼관리자 승인 후 사용 가능합니다.</p>
              <div className="mt-5 space-y-4">
                <InputField label="소속" value="영월진로센터" />
                <InputField label="이름" value="박서연" />
                <InputField label="연락처" value="010-1234-5678" placeholder="000-0000-0000" />
                <InputField label="이메일" value="coach02@example.com" placeholder="example@email.com" />
                <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  신청 완료 후 관리자 승인 전까지 로그인 및 학생 조회는 제한됩니다.
                </div>
                <button className="w-full rounded-2xl bg-violet-500 px-4 py-3 text-sm font-medium text-white">코치 가입 신청</button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#111322] p-5 shadow-2xl">
              <div className="text-xs text-violet-300">Super Admin</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">슈퍼관리자 계정 등록</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">슈퍼관리자는 일반 공개 가입 폼을 사용하지 않으며, 운영자가 별도로 생성합니다.</p>
              <div className="mt-5 space-y-4">
                <InputField label="소속" value="본부" disabled />
                <InputField label="이름" value="관리자A" disabled />
                <InputField label="연락처" value="010-1111-2222" disabled />
                <InputField label="이메일" value="admin@example.com" disabled />
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  생성 방식: 운영자 등록 또는 시스템 초기 계정 생성
                </div>
                <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white">운영자 등록 안내</button>
              </div>
            </div>
          </div>
        </section>
        <header className="rounded-[28px] border border-violet-400/20 bg-[#0f1220] p-6 shadow-2xl">
          <div className="text-sm font-medium text-violet-300">회원관리 UI 제안</div>
          <h1 className="mt-2 text-4xl font-bold">왼쪽 메뉴 클릭형 상세 페이지 UI</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
            현재 회원관리 대시보드 구조를 유지하면서, 왼쪽 메뉴를 클릭하면 우측 상세 영역이 바뀌는 방식으로 구성했습니다.
            역할별 권한 범위에 따라 보이는 메뉴와 상세 페이지를 다르게 설계했습니다.
          </p>
        </header>

        <PageShell
          badge="Super Admin Workspace"
          title="슈퍼관리자 전용 회원관리 화면"
          description="전체 회원, 승인, 배정, 기준정보, 권한 정책까지 관리자 업무를 한 곳에서 탐색할 수 있는 구조입니다."
          selected={adminSelected}
          sidebar={<Sidebar title="관리자 콘솔" role="super_admin" menu={adminMenu} selected={adminSelected} onSelect={setAdminSelected} />}
          stats={renderAdminContent.stats}
          mainLeft={renderAdminContent.left}
          mainRight={renderAdminContent.right}
        />

        <PageShell
          badge="Coach Workspace"
          title="코치 전용 회원관리 화면"
          description="코치는 담당 학생 조회와 본인 정보 관리만 가능하도록 메뉴와 상세 화면을 제한했습니다."
          selected={coachSelected}
          sidebar={<Sidebar title="코치 업무" role="coach" menu={coachMenu} selected={coachSelected} onSelect={setCoachSelected} />}
          stats={renderCoachContent.stats}
          mainLeft={renderCoachContent.left}
          mainRight={renderCoachContent.right}
        />

        <PageShell
          badge="Student Workspace"
          title="학생 전용 내 정보 관리 화면"
          description="학생은 본인 정보 조회와 허용된 항목 수정만 가능하도록 단순하고 명확한 상세 페이지 구조로 구성했습니다."
          selected={studentSelected}
          sidebar={<Sidebar title="내 계정" role="student" menu={studentMenu} selected={studentSelected} onSelect={setStudentSelected} />}
          stats={renderStudentContent.stats}
          mainLeft={renderStudentContent.left}
          mainRight={renderStudentContent.right}
        />
      </div>
    </div>
  );
}
