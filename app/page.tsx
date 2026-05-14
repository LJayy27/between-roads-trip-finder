"use client";

import { useState } from "react";

type TripResult = {
  tripVibe: string;
  recommendedRouteType: string;
  summary: string;
  packingPriorities: string[];
  beginnerTips: string[];
  dogFriendlyNotes: string[];
  vanComfortTips: string[];
  addOnsToConsider: string[];
  confidenceChecklist: string[];
};

export default function Home() {
  const [formData, setFormData] = useState({
    startingLocation: "",
    numberOfDays: "",
    season: "",
    travelStyle: "",
    dogComing: "No",
    comfortLevel: "",
    mainConcern: "",
  });

  const [result, setResult] = useState<TripResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: string, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

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
        body: JSON.stringify(formData),
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
          : "Something went wrong while generating your trip fit."
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
          Trip Fit Finder
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-8 text-stone-600">
          Answer a few quick questions and get beginner-friendly van trip
          guidance for your route, packing priorities, comfort needs, and
          confidence level.
        </p>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                Starting location
              </label>
              <input
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
                placeholder="Denver, CO"
                maxLength={80}
                value={formData.startingLocation}
                onChange={(event) =>
                  updateField("startingLocation", event.target.value)
                }
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                Number of days
              </label>
              <input
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
                placeholder="3"
                maxLength={20}
                value={formData.numberOfDays}
                onChange={(event) =>
                  updateField("numberOfDays", event.target.value)
                }
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                Season or month
              </label>
              <input
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
                placeholder="June, fall, winter, etc."
                maxLength={60}
                value={formData.season}
                onChange={(event) => updateField("season", event.target.value)}
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                Travel style
              </label>
              <select
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
                value={formData.travelStyle}
                onChange={(event) =>
                  updateField("travelStyle", event.target.value)
                }
              >
                <option value="">Choose one</option>
                <option value="Slow and scenic">Slow and scenic</option>
                <option value="Desert adventure">Desert adventure</option>
                <option value="Mountain reset">Mountain reset</option>
                <option value="Hot springs and relaxation">
                  Hot springs and relaxation
                </option>
                <option value="Beginner-friendly weekend">
                  Beginner-friendly weekend
                </option>
              </select>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                Is a dog coming?
              </label>
              <select
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
                value={formData.dogComing}
                onChange={(event) =>
                  updateField("dogComing", event.target.value)
                }
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                Comfort level with van travel
              </label>
              <select
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
                value={formData.comfortLevel}
                onChange={(event) =>
                  updateField("comfortLevel", event.target.value)
                }
              >
                <option value="">Choose one</option>
                <option value="First time">First time</option>
                <option value="Some camping experience">
                  Some camping experience
                </option>
                <option value="Comfortable with road trips">
                  Comfortable with road trips
                </option>
                <option value="Experienced camper">Experienced camper</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                Main concern
              </label>
              <textarea
                className="min-h-28 w-full rounded-xl border border-stone-300 px-4 py-3"
                placeholder="Packing, driving, sleeping, finding campsites, using the van systems..."
                maxLength={500}
                value={formData.mainConcern}
                onChange={(event) =>
                  updateField("mainConcern", event.target.value)
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-stone-900 px-5 py-3 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Creating your trip fit..." : "Generate trip fit"}
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
                Your personalized trip guidance will appear here.
              </div>
            )}

            {loading && (
              <div className="flex h-full min-h-96 items-center justify-center rounded-2xl bg-stone-100 p-8 text-center text-stone-500">
                Thinking through your route style, comfort needs, and packing
                priorities...
              </div>
            )}

            {result && (
              <div className="space-y-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-stone-500">
                    Your trip vibe
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold">
                    {result.tripVibe}
                  </h2>
                </div>

                <ResultBlock
                  title="Recommended route type"
                  content={result.recommendedRouteType}
                />

                <ResultBlock title="Summary" content={result.summary} />

                <ResultList
                  title="Packing priorities"
                  items={result.packingPriorities}
                />

                <ResultList title="Beginner tips" items={result.beginnerTips} />

                <ResultList
                  title="Dog-friendly notes"
                  items={result.dogFriendlyNotes}
                />

                <ResultList
                  title="Van comfort tips"
                  items={result.vanComfortTips}
                />

                <ResultList
                  title="Add-ons to consider"
                  items={result.addOnsToConsider}
                />

                <ResultList
                  title="Confidence checklist"
                  items={result.confidenceChecklist}
                />

                <p className="rounded-2xl border border-stone-200 bg-white p-4 text-xs leading-5 text-stone-500">
  This is a starter recommendation, not a final itinerary. Before traveling,
  check current weather, road conditions, campground rules, pet policies,
  permits, fire restrictions, and local regulations.
</p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
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