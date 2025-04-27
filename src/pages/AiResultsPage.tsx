import React from "react";
import { useNavigate } from "react-router-dom";
import { useYield } from "@/context/YieldContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bot } from "lucide-react";

export default function AiResultsPage() {
  const navigate = useNavigate();
  const { selectedAssets } = useYield();
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [aiResult, setAiResult] = React.useState<string | null>(null);

  React.useEffect(() => {
    setAiResult(null);
    setAiError(null);
    setAiLoading(true);
    const fetchAI = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/ai-suggest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedAssets }),
        });
        if (!res.ok) throw new Error("Failed to fetch AI suggestion");
        const data = await res.json();
        setAiResult(data.suggestion || "No suggestion returned.");
      } catch (err: any) {
        setAiError(err.message || "Unknown error");
      } finally {
        setAiLoading(false);
      }
    };
    fetchAI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAssets]);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/results")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Results
      </Button>
      <Card className="border-polkadot-primary/20 bg-polkadot-light/50 shadow-md">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="p-2 rounded-full bg-polkadot-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-polkadot-primary" />
          </div>
          <CardTitle className="text-polkadot-dark text-xl">
            AI Strategy Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {aiLoading && (
            <div className="flex flex-col items-center py-8 min-h-[120px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-polkadot-primary mb-4"></div>
              <p className="text-gray-600">AI is thinking...</p>
            </div>
          )}
          {aiError && (
            <div className="text-red-500 py-8 min-h-[120px]">{aiError}</div>
          )}
          {aiResult && (
            <div
              className="text-gray-800 whitespace-pre-line text-left w-full py-8 min-h-[120px]"
              dangerouslySetInnerHTML={{ __html: aiResult }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
