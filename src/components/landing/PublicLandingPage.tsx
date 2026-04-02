"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  CheckCircle2,
  Download,
  Heart,
  Lightbulb,
  Mail,
  Menu,
  Phone,
  Presentation,
  Rocket,
  Users,
  X,
} from "lucide-react";
import {
  PUBLIC_LANDING_CURRICULUM,
  PUBLIC_LANDING_EFFECTS,
  PUBLIC_LANDING_FEATURES,
  PUBLIC_LANDING_OPERATION_TYPES,
  PUBLIC_LANDING_ROADMAP_STEPS,
  PUBLIC_LANDING_WORKBOOK_CONTENTS,
} from "./publicLandingData";

export function PublicLandingPage() {
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  const openLoginPrompt = () => setLoginPromptOpen(true);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
    openLoginPrompt();
  };

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div
      data-theme="light"
      className="min-h-screen bg-white font-sidebar text-[var(--color-text)] antialiased"
    >
      <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-mint-500" />
              <span className="bg-gradient-to-r from-mint-500 to-orange-500 bg-clip-text text-xl font-bold text-transparent">
                Y·Start Up
              </span>
            </Link>
            <div className="hidden items-center gap-2 md:flex md:gap-3">
              <Button type="button" variant="ghost" onClick={() => scrollToId("curriculum")}>
                커리큘럼
              </Button>
              <Button type="button" variant="ghost" onClick={() => scrollToId("workbook")}>
                워크북
              </Button>
              <Button type="button" variant="ghost" onClick={() => scrollToId("features")}>
                특징
              </Button>
              <div className="flex items-center gap-1.5">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <Link href="/signup/student">학생 회원가입</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-mint-200 text-mint-700 hover:bg-mint-50"
                >
                  <Link href="/signup/coach">코치 회원가입</Link>
                </Button>
              </div>
              <Button asChild className="bg-mint-500 text-white hover:bg-mint-600">
                <Link href="/login">로그인</Link>
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </Button>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
              mobileMenuOpen ? "max-h-[28rem] border-t border-gray-100 pt-4 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-2 pb-4">
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => scrollToId("curriculum")}
              >
                커리큘럼
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => scrollToId("workbook")}
              >
                워크북
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => scrollToId("features")}
              >
                특징
              </Button>
              <Button asChild variant="outline" className="w-full justify-start border-orange-200 text-orange-700">
                <Link href="/signup/student">학생 회원가입</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start border-mint-200 text-mint-700">
                <Link href="/signup/coach">코치 회원가입</Link>
              </Button>
              <Button asChild className="w-full bg-mint-500 text-white hover:bg-mint-600">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  로그인
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-mint-50 via-white to-orange-50 py-20 md:py-32">
        <div className="landing-bg-grid absolute inset-0 opacity-[0.35]" aria-hidden />
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="landing-animate-fade-in space-y-6">
              <Badge className="border-mint-200 bg-mint-100 text-mint-700">창업교육 워크북</Badge>
              <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
                미래의 문제해결가를 키우는
                <span className="mt-2 block bg-gradient-to-r from-mint-500 to-orange-500 bg-clip-text text-transparent">
                  창의적 여정
                </span>
              </h1>
              <p className="text-xl leading-relaxed text-gray-600">
                청소년이 스스로 질문하고, 해결하고, 발표하는
                <br />
                <span className="font-semibold text-gray-900">경험 중심 창업교육 워크북</span>
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  type="button"
                  onClick={openLoginPrompt}
                  size="lg"
                  className="bg-mint-500 text-white shadow-[0_10px_30px_-10px_rgba(20,184,166,0.45)] hover:bg-mint-600"
                >
                  <Download className="mr-2 h-5 w-5" />
                  시작하기
                </Button>
                <Button
                  type="button"
                  onClick={openLoginPrompt}
                  size="lg"
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  교육문의하기
                </Button>
              </div>
              <p className="text-sm italic text-gray-500">
                &ldquo;배우는 창업이 아니라, 경험하는 창업.&rdquo;
              </p>
            </div>
            <div className="landing-animate-fade-in-delay relative">
              <div className="relative mx-auto aspect-square max-w-lg">
                <div className="absolute inset-0 rotate-6 rounded-3xl bg-gradient-to-br from-mint-200 to-orange-200" />
                <div className="absolute inset-0 flex -rotate-3 items-center justify-center rounded-3xl bg-gradient-to-br from-mint-100 to-orange-100 shadow-2xl">
                  <div className="p-8 text-center">
                    <BookOpen className="mx-auto mb-4 h-24 w-24 text-mint-600" />
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">Y·Start Up</h3>
                    <p className="text-gray-600">창업교육과정 워크북</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              창업은 단순 회사 설립이 아닌
              <br />
              <span className="text-mint-700">문제 해결 중심의 과정</span>입니다
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              Y·Start Up 창업교육과정은 청소년이 실제로 마주하는 문제를 발견하고, 창의적 해결책을
              도출하며, 팀과 함께 프로젝트를 완성하는 경험 중심 교육입니다. 이론보다 실습, 결과보다
              과정을 중시하는 교육 철학으로 학습자의 역량을 키웁니다.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="bg-gradient-to-b from-white to-mint-50/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-orange-200 bg-orange-100 text-orange-800">핵심 특징</Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              체계적이고 실전적인 교육 시스템
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              6가지 핵심 특징으로 구성된 완성형 창업교육 프로그램
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PUBLIC_LANDING_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  variant="default"
                  className="border-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardHeader>
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor}`}
                    >
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="curriculum" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-mint-200 bg-mint-100 text-mint-700">커리큘럼</Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              총 10회 20차시 창업교육 로드맵
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              문제 인식부터 피칭까지 완성되는 단계별 학습 과정
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {PUBLIC_LANDING_CURRICULUM.map((item, index) => (
              <Card
                key={index}
                variant="default"
                className="border-2 border-mint-100 bg-white transition-all duration-300 hover:border-mint-400 hover:shadow-lg"
              >
                <CardHeader className="pb-4 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-mint-400 to-orange-400 text-lg font-bold text-white">
                    {item.session}
                  </div>
                  <CardTitle className="text-lg text-gray-900">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm text-gray-600">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="workbook" className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-orange-200 bg-orange-100 text-orange-800">워크북 목차</Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">체계적인 학습 구성</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              10개 주제로 구성된 완성형 창업교육 워크북
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {PUBLIC_LANDING_WORKBOOK_CONTENTS.map((item, index) => (
              <Card
                key={index}
                variant="default"
                className={`border-2 bg-white ${item.borderColor} transition-all duration-300 hover:shadow-lg`}
              >
                <CardHeader className="pb-4 text-center">
                  <div
                    className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-lg font-bold text-white shadow-md`}
                  >
                    {item.number}
                  </div>
                  <CardTitle className="text-lg text-gray-900">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm text-gray-600">
                    {item.subtitle}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-orange-50 to-mint-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <Badge className="mb-4 border-orange-200 bg-orange-100 text-orange-800">
                교수자 가이드
              </Badge>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                교사의 역할은 멘토, 코치, 촉진자입니다
              </h2>
            </div>
            <div className="mb-8 grid gap-6 md:grid-cols-3">
              <Card variant="default" className="border-2 border-orange-200 text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                    <span className="text-2xl font-bold text-orange-600">20%</span>
                  </div>
                  <CardTitle className="text-gray-900">이론</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    핵심 개념과 방법론 중심의 간결한 강의
                  </CardDescription>
                </CardContent>
              </Card>
              <Card variant="default" className="border-2 border-mint-400 text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mint-100">
                    <span className="text-2xl font-bold text-mint-700">60%</span>
                  </div>
                  <CardTitle className="text-gray-900">실습</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    워크북 중심의 직접 경험과 프로젝트 활동
                  </CardDescription>
                </CardContent>
              </Card>
              <Card variant="default" className="border-2 border-orange-200 text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                    <span className="text-2xl font-bold text-orange-600">20%</span>
                  </div>
                  <CardTitle className="text-gray-900">발표·성찰</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    피드백과 성찰을 통한 학습 내재화
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
            <Card variant="default" className="border-2 border-mint-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Presentation className="h-5 w-5 text-mint-600" />
                  진행 팁
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint-600" />
                  <p className="text-gray-700">
                    학습자의 자율성을 최대한 보장하며 적절한 시점에 코칭을 제공합니다
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint-600" />
                  <p className="text-gray-700">팀워크와 협업을 촉진하는 분위기를 조성합니다</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint-600" />
                  <p className="text-gray-700">실패를 학습 기회로 전환하며 성장을 격려합니다</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Card className="border-0 bg-gradient-to-br from-mint-500 to-orange-500 text-white shadow-2xl">
              <CardHeader className="text-center">
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                  이 수업의 주인공은 바로 당신입니다
                </h2>
                <p className="text-xl text-white/90">적극적인 참여와 소통이 성공적인 학습의 열쇠입니다</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  {[
                    { icon: Lightbulb, title: "생각하기", desc: "스스로 질문하고 탐구하세요" },
                    { icon: BookOpen, title: "기록하기", desc: "워크북에 과정을 남기세요" },
                    { icon: Users, title: "협업하기", desc: "팀원과 함께 아이디어를 발전시키세요" },
                    { icon: Presentation, title: "발표하기", desc: "생각과 결과를 나누세요" },
                    { icon: Heart, title: "성찰하기", desc: "경험을 통해 배움을 내재화하세요" },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                          <Icon className="h-8 w-8" />
                        </div>
                        <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                        <p className="text-sm text-white/80">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-orange-50/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-mint-200 bg-mint-100 text-mint-700">교육 효과</Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">5가지 핵심 역량 향상</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              경험 중심 창업교육을 통해 기를 수 있는 핵심 역량들
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-5">
            {PUBLIC_LANDING_EFFECTS.map((effect, index) => {
              const Icon = effect.icon;
              return (
                <Card
                  key={index}
                  variant="default"
                  className="border-2 border-mint-100 text-center transition-all duration-300 hover:border-mint-400 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-mint-400 to-orange-400 text-white">
                      <Icon className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{effect.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600">{effect.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-orange-200 bg-orange-100 text-orange-800">운영 형태</Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              다양한 형태로 운영 가능합니다
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              학교와 기관의 상황에 맞게 유연하게 적용할 수 있습니다
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PUBLIC_LANDING_OPERATION_TYPES.map((op, index) => {
              const Icon = op.icon;
              return (
                <Card
                  key={index}
                  variant="default"
                  className="border-2 border-orange-100 transition-all duration-300 hover:border-orange-400 hover:shadow-lg"
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-orange-100">
                      <Icon className="h-8 w-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{op.type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600">{op.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-mint-50 to-orange-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-mint-200 bg-mint-100 text-mint-700">전체 프로세스</Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              문제 해결에서 성찰까지
            </h2>
          </div>
          <div className="mx-auto max-w-4xl">
            <div className="hidden h-1 w-full rounded-full bg-gradient-to-r from-mint-300 via-orange-300 to-mint-300 md:block md:translate-y-[3.25rem]" />
            <div className="grid grid-cols-2 gap-8 md:grid-cols-5 md:gap-4">
              {PUBLIC_LANDING_ROADMAP_STEPS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="z-10 mb-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-mint-400 bg-white shadow-lg">
                      <Icon className="h-8 w-8 text-mint-700" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{item.step}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-mint-500 to-orange-500 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">지금 바로 시작하세요</h2>
            <p className="text-xl text-white/90">
              로그인 후 워크북과 교육 프로그램을 이용할 수 있습니다
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                type="button"
                onClick={openLoginPrompt}
                size="lg"
                className="bg-white text-mint-700 shadow-lg hover:bg-gray-100"
              >
                <Download className="mr-2 h-5 w-5" />
                시작하기
              </Button>
              <Button
                type="button"
                onClick={openLoginPrompt}
                size="lg"
                className="border-2 border-orange-800 bg-orange-600 text-white shadow-lg hover:bg-orange-700"
              >
                <Mail className="mr-2 h-5 w-5" />
                교육문의하기
              </Button>
            </div>
            <div className="border-t border-white/20 pt-8">
              <form
                onSubmit={handleSubscribe}
                className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <Input
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border-white/30 bg-white/10 text-white placeholder:text-white/60"
                  required
                />
                <Button
                  type="submit"
                  className="bg-white text-mint-700 hover:bg-gray-100"
                >
                  구독하기
                </Button>
              </form>
              <p className="mt-3 text-sm text-white/80">새 소식은 로그인 후 알림에서 확인할 수 있습니다</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Rocket className="h-6 w-6 text-mint-400" />
                <span className="text-xl font-bold">Y·Start Up</span>
              </div>
              <p className="text-gray-400">미래의 문제해결가를 키우는 창의적 여정</p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">빠른 링크</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToId("features")}
                    className="transition-colors hover:text-mint-400"
                  >
                    특징
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToId("curriculum")}
                    className="transition-colors hover:text-mint-400"
                  >
                    커리큘럼
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToId("workbook")}
                    className="transition-colors hover:text-mint-400"
                  >
                    워크북
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openLoginPrompt}
                    className="transition-colors hover:text-mint-400"
                  >
                    시작하기
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">문의</h3>
              <p className="text-gray-400">프로그램 교육 문의</p>
              <Button
                type="button"
                onClick={openLoginPrompt}
                className="mt-4 bg-mint-500 text-white hover:bg-mint-600"
              >
                교육문의하기
              </Button>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Y·Start Up 창업교육과정. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-30 animate-bounce">
        <Button
          type="button"
          onClick={openLoginPrompt}
          size="lg"
          className="rounded-full bg-mint-500 px-6 text-white shadow-2xl hover:bg-mint-600"
        >
          <Download className="mr-2 h-5 w-5" />
          시작하기
        </Button>
      </div>

      <Dialog open={loginPromptOpen} onOpenChange={setLoginPromptOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">로그인이 필요합니다</DialogTitle>
            <DialogDescription className="text-base pt-2">
              워크북·교육 문의·구독 안내는 로그인 후 이용할 수 있습니다. 계정이 없으시면
              학생 또는 코치 회원가입으로 시작하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/80 px-4 py-3 text-sm text-gray-700">
            <Phone
              className="mt-0.5 h-5 w-5 shrink-0 text-mint-600"
              aria-hidden
            />
            <div className="min-w-0 space-y-0.5">
              <p>문의 : 한국창업융합연구원 엄수현 원장</p>
              <a
                href="tel:01082271730"
                className="font-medium text-mint-700 underline-offset-2 hover:underline"
              >
                010-8227-1730
              </a>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setLoginPromptOpen(false)}>
              닫기
            </Button>
            <Button asChild className="border-orange-300 bg-orange-600 text-white hover:bg-orange-700">
              <Link href="/signup/student">학생 회원가입</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-mint-400 bg-white text-mint-700 hover:bg-mint-50"
            >
              <Link href="/signup/coach">코치 회원가입</Link>
            </Button>
            <Button asChild className="bg-mint-500 text-white hover:bg-mint-600">
              <Link href="/login">로그인</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
