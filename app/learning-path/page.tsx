"use client";

import { useState, useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import { OnboardingForm } from "@/components/learning-path/OnboardingForm";
import { RoadmapVisualization } from "@/components/learning-path/RoadmapVisualization";
import {
  generateLearningPath,
  UserProfile,
  LearningPath,
} from "@/app/actions/learning-path";
import { getFeatureFlag } from "@/lib/featureFlags";
import Link from "next/link";

export default function LearningPathPage() {
  const [isEnabledUI, setIsEnabledUI] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsEnabledUI(getFeatureFlag("features_enabled"));
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  return <>{isEnabledUI ? <LearningPathFeature /> : <ComingSoon />}</>;
}

function LearningPathFeature() {
  const [stage, setStage] = useState<"onboarding" | "roadmap">("onboarding");
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProfileComplete = async (profile: UserProfile) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateLearningPath(profile);

      if ("error" in result) {
        setError(result.error);
        setIsGenerating(false);
        return;
      }

      setLearningPath(result);
      setStage("roadmap");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setStage("onboarding");
    setLearningPath(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-accent-yellow selection:text-black">
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-6 bg-red-500/10 border-4 border-red-500 text-center animate-[fade-in-up_0.3s_ease-out]">
              <div className="text-3xl mb-2">⚠️</div>
              <div className="font-bold text-red-500 text-lg mb-2">
                Oops! Something went wrong
              </div>
              <div className="text-gray-400">{error}</div>
              <button
                onClick={() => setError(null)}
                className="mt-4 px-6 py-2 bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Onboarding Form */}
          {stage === "onboarding" && (
            <OnboardingForm
              onComplete={handleProfileComplete}
              isLoading={isGenerating}
            />
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm animate-[fade-in-up_0.5s_ease-out]">
              <div className="max-w-2xl w-full mx-4">
                <div className="bg-card-bg border-4 border-accent-yellow shadow-[8px_8px_0px_0px_#FFD300] p-8 md:p-12">
                  <div className="text-center space-y-6">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 bg-gradient-to-br from-accent-yellow to-accent-mint rounded-full flex items-center justify-center animate-spin">
                        <div className="w-16 h-16 bg-card-bg rounded-full flex items-center justify-center">
                          <span className="text-3xl">⚡</span>
                        </div>
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-r from-accent-blue via-accent-yellow to-accent-mint rounded-full opacity-20 animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-2xl md:text-3xl font-black text-white">
                        Generating Your Roadmap...
                      </h2>
                      <p className="text-lg text-gray-400 max-w-md mx-auto">
                        AI is crafting a personalized learning path tailored
                        just for you
                      </p>
                      <div className="flex justify-center space-x-1 mt-4">
                        <div className="w-2 h-2 bg-accent-yellow rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-accent-mint rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-accent-blue rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Roadmap Visualization */}
          {stage === "roadmap" && learningPath && !isGenerating && (
            <div className="animate-[fade-in-up_0.5s_ease-out]">
              <RoadmapVisualization
                learningPath={learningPath}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#3B00B9 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="max-w-3xl text-center space-y-4 relative z-10 px-4">
        {/* Icon */}
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 bg-card-bg mx-auto -rotate-6 border-4 border-accent-yellow shadow-[8px_8px_0px_0px_#00FFF0] flex items-center justify-center transition-transform hover:rotate-0 duration-300">
            <span className="text-5xl">🎯</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight">
          YOUR <span className="text-accent-yellow">PERSONALIZED</span>
          <br />
          LEARNING PATH
          <br />
          <span className="text-accent-mint">COMING SOON</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">
          AI-powered roadmaps for{" "}
          <span className="text-accent-yellow font-bold">beginners</span>,
          <span className="text-accent-mint font-bold"> juniors</span>, and
          <span className="text-accent-blue font-bold"> seniors</span>.
          <br />
          Your journey to mastery starts here.
        </p>

        {/* Features Preview */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-card-bg border-2 border-accent-yellow">
            <div className="text-3xl mb-2">🤖</div>
            <div className="font-bold text-white text-sm">
              AI-Generated Paths
            </div>
          </div>
          <div className="p-4 bg-card-bg border-2 border-accent-mint">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-bold text-white text-sm">
              Progress Tracking
            </div>
          </div>
          <div className="p-4 bg-card-bg border-2 border-accent-blue">
            <div className="text-3xl mb-2">🎓</div>
            <div className="font-bold text-white text-sm">
              Curated Resources
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-8">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-accent-yellow text-background font-black text-lg uppercase tracking-widest hover:translate-y-1 hover:shadow-none shadow-[6px_6px_0px_0px_#FFFFFF] transition-all border-2 border-white"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
