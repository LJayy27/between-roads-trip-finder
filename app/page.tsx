"use client";

import { useState } from "react";

type RouteIdea = {
  routeName: string;
  routeType: string;
  suggestedLoop: string[];
  bestFor: string;
  routeRhythm: string;
  highlights: string[];
  watchOuts: string[];
  verifyBeforeYouGo: string[];
};

type RouteResult = {
  routeSetTitle: string;
  overallFit: string;
  routes: RouteIdea[];
  nextStep: string;
};

export default function Home() {
  const [tripDescription, setTripDescription] = useState("");
  const [result, setResult] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/trip-finder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating your route ideas."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12 text-stone-900">
      <section className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-stone-500">
          Between Roads
        </p>

        <h1 className="mb-4 text-5xl font-semibold tracking-tight">
          Starter Route Finder
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-8 text-stone-600">
          Describe the kind of van trip you&apos;re imagining, and we&apos;ll
          suggest a few beginner-friendly route ideas with real places to
          explore.
        </p>

        <p className="mb-10 max-w-3xl rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-600 shadow-sm">
          These are starting points, not final itineraries - always check
          current weather, road conditions, campground rules, pet policies,
          fire restrictions, reservations, and local regulations before you go.
        </p>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                What kind of trip are you imagining?
              </label>
              <textarea
                required
                className="min-h-56 w-full rounded-xl border border-stone-300 px-4 py-3"
                placeholder="I’m starting in Denver and want a 3-day mountain loop in June with hot springs, small towns, easy hikes, and dog-friendly stops. I’m newer to van travel and don’t want to drive too much each day."
                maxLength={1000}
                value={tripDescription}
                onChange={(event) => setTripDescription(event.target.value)}
              />
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Include anything that matters: starting point, trip length,
                season, route vibe, pets, comfort level, places you&apos;re
                curious about, or anything you want to avoid.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-stone-900 px-5 py-3 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Looking for route ideas that match your trip style..." : "Suggest route ideas"}
            </button>

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </p>
            )}
          </form>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            {!result && !loading && (
              <div className="flex h-full min-h-96 items-center justify-center rounded-2xl bg-stone-100 p-8 text-center text-stone-500">
                Your starter route ideas will appear here.
              </div>
            )}

            {loading && (
              <div className="flex h-full min-h-96 items-center justify-center rounded-2xl bg-stone-100 p-8 text-center text-stone-500">
                Looking for route ideas that match your trip style...
              </div>
            )}

            {result && (
              <div className="space-y-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-stone-500">
                    Starter route ideas
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold">
                    {result.routeSetTitle}
                  </h2>
                </div>

                <ResultBlock title="Overall fit" content={result.overallFit} />

                <div className="space-y-4">
                  {result.routes?.map((route, index) => (
                    <RouteCard key={`${route.routeName}-${index}`} route={route} />
                  ))}
                </div>

                <ResultBlock title="Suggested next step" content={result.nextStep} />

                <p className="rounded-2xl border border-stone-200 bg-white p-4 text-xs leading-5 text-stone-500">
                  These are starter route ideas, not final itineraries. Before
                  traveling, check current weather, road conditions,
                  campground rules, pet policies, reservations, fire
                  restrictions, and local regulations.
                </p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function RouteCard({ route }: { route: RouteIdea }) {
  return (
    <div className="rounded-2xl bg-stone-100 p-5">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{route.routeName}</h3>
        <p className="mt-1 text-sm uppercase tracking-[0.16em] text-stone-500">
          {route.routeType}
        </p>
      </div>

      <div className="space-y-4">
        <ResultBlock
          title="Suggested loop"
          content={route.suggestedLoop?.join(" → ")}
        />
        <ResultBlock title="Best for" content={route.bestFor} />
        <ResultBlock title="Route rhythm" content={route.routeRhythm} />
        <ResultList title="Highlights" items={route.highlights} />
        <ResultList title="Watch-outs" items={route.watchOuts} />
        <ResultList
          title="Verify before you go"
          items={route.verifyBeforeYouGo}
        />
      </div>
    </div>
  );
}

function ResultBlock({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="rounded-2xl bg-stone-100 p-4">
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm leading-6 text-stone-700">{content}</p>
    </div>
  );
}

function ResultList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl bg-stone-100 p-4">
      <h3 className="mb-2 font-semibold">{title}</h3>
      <ul className="space-y-2 text-sm leading-6 text-stone-700">
        {items?.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
