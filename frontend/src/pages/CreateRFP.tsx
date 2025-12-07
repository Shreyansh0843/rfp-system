import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Sparkles, 
  Send,
  Loader2,
  FileText,
  DollarSign,
  Clock,
  Package,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ParsedRFP {
  title: string;
  items: { name: string; quantity: number; specs: string }[];
  budget: string;
  deliveryDays: number;
  paymentTerms: string;
  warranty: string;
}

export default function CreateRFP() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requirements, setRequirements] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedRFP, setParsedRFP] = useState<ParsedRFP | null>(null);

  const handleCreateRFP = async () => {
    if (!requirements.trim()) {
      toast({
        title: "Please enter requirements",
        description: "Describe what you want to procure in natural language.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Mock parsed result
    setParsedRFP({
      title: "IT Equipment Procurement",
      items: [
        { name: "Laptops", quantity: 20, specs: "16GB RAM, Intel i7 processor" },
        { name: "Monitors", quantity: 15, specs: "27-inch, 4K resolution" },
      ],
      budget: "$50,000",
      deliveryDays: 30,
      paymentTerms: "Net 30",
      warranty: "1 year minimum",
    });
    
    setIsProcessing(false);
    
    toast({
      title: "RFP created successfully!",
      description: "Your requirements have been parsed and structured.",
    });
  };

  const handleSendRFP = () => {
    toast({
      title: "RFP Ready",
      description: "Navigate to send this RFP to vendors.",
    });
    navigate("/rfps");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link to="/rfps">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to RFPs
          </Link>
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Create New RFP</h1>
        </div>
        <p className="text-muted-foreground">
          Describe your procurement requirements in natural language, and our AI will create a structured RFP for you.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-card rounded-2xl p-6 shadow-md mb-6">
        <Label htmlFor="requirements" className="text-base font-semibold mb-3 block">
          Describe Your Requirements
        </Label>
        <Textarea
          id="requirements"
          placeholder="Example: I need to procure 20 laptops with 16GB RAM and Intel i7 processor, and 15 monitors that are 27-inch with 4K resolution. Budget is $50,000 total. Need delivery within 30 days. Payment terms should be net 30, and we need at least 1 year warranty."
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className="min-h-[180px] text-base resize-none mb-4"
        />
        <p className="text-sm text-muted-foreground mb-4">
          Be as specific as possible. Include: items needed, quantities, specifications, budget, delivery timeframe, payment terms, and warranty requirements.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/rfps">Cancel</Link>
          </Button>
          <Button 
            onClick={handleCreateRFP}
            disabled={isProcessing || !requirements.trim()}
            className="bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing with AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create RFP
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Parsed RFP Preview */}
      {parsedRFP && (
        <div className="bg-card rounded-2xl p-6 shadow-md animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <h2 className="text-xl font-semibold text-foreground">RFP Generated</h2>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <Label className="text-sm text-muted-foreground">Title</Label>
              <p className="text-lg font-semibold text-foreground">{parsedRFP.title}</p>
            </div>

            {/* Items */}
            <div>
              <Label className="text-sm text-muted-foreground mb-3 block">Items Required</Label>
              <div className="space-y-3">
                {parsedRFP.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {item.quantity}x {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{item.specs}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Budget</span>
                </div>
                <p className="font-semibold text-foreground">{parsedRFP.budget}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Delivery</span>
                </div>
                <p className="font-semibold text-foreground">{parsedRFP.deliveryDays} days</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Payment</span>
                </div>
                <p className="font-semibold text-foreground">{parsedRFP.paymentTerms}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm">Warranty</span>
                </div>
                <p className="font-semibold text-foreground">{parsedRFP.warranty}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setParsedRFP(null)}>
                Edit Requirements
              </Button>
              <Button onClick={handleSendRFP} className="bg-gradient-primary hover:opacity-90">
                <Send className="h-4 w-4 mr-2" />
                Send to Vendors
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
