import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="inline-block">
            <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              Prediction Markets for GitHub
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight">
            CodeMerge
            <span className="block text-indigo-600">Markets</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Bet on whether GitHub PRs will be merged. Use prediction markets to
            forecast merge outcomes and compete on the leaderboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github`}>
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple prediction markets for your development team
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-indigo-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Predict PR Merges</CardTitle>
              <CardDescription>
                Markets automatically created for open pull requests. Bet on
                whether they'll merge before the deadline.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-indigo-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>LMSR Pricing</CardTitle>
              <CardDescription>
                Prices determined by Logarithmic Market Scoring Rule. More
                accurate probabilities as more people trade.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-indigo-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Leaderboards</CardTitle>
              <CardDescription>
                Compete with your team. See who's the best at forecasting PR
                outcomes and climb the rankings.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">
              Ready to start predicting?
            </CardTitle>
            <CardDescription className="text-indigo-100 text-lg">
              Connect your GitHub account and start trading on PR markets today.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
            >
              <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github`}>
                Sign in with GitHub
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
