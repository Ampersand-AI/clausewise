import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Loader2, AlertCircle, CheckCircle2, Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { documentService } from '@/services/documentService';
import { analysisService } from '@/services/analysisService';
import { Document } from '@/types/document';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DocumentView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (id) {
      loadDocument(id);
      checkAnalysisStatus(id);
    }
  }, [id]);

  const loadDocument = async (documentId: string) => {
    try {
      const { data, error } = await documentService.getDocument(documentId);
      if (error) throw error;
      setDocument(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load document.",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAnalysisStatus = async (documentId: string) => {
    const { status, error } = await analysisService.getAnalysisStatus(documentId);
    if (error) {
      console.error('Error checking analysis status:', error);
      return;
    }
    if (status === 'processing') {
      setAnalyzing(true);
      // Poll for status updates
      const interval = setInterval(async () => {
        const { status: newStatus } = await analysisService.getAnalysisStatus(documentId);
        if (newStatus !== 'processing') {
          setAnalyzing(false);
          clearInterval(interval);
          loadDocument(documentId); // Reload document to get updated analysis
        }
      }, 5000); // Check every 5 seconds
    }
  };

  const handleAnalyze = async () => {
    if (!id) return;
    
    setAnalyzing(true);
    try {
      const { error } = await analysisService.analyzeDocument(id);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Document analysis started. This may take a few minutes.",
      });
      
      // Start polling for status updates
      checkAnalysisStatus(id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start document analysis.",
      });
      setAnalyzing(false);
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Document not found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The document you're looking for doesn't exist or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/documents')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{document.title}</h2>
            <p className="text-sm text-muted-foreground">
              Uploaded on {new Date(document.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        {document.status === 'pending' && (
          <Button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="gap-2"
          >
            {analyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {analyzing ? 'Analyzing...' : 'Start Analysis'}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          {getStatusIcon(document.status)}
          <span className="capitalize">{document.status}</span>
        </Badge>
        <Badge variant="outline">
          {Math.round(document.file_size / 1024)} KB
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                  <p className="mt-1">{document.description || 'No description provided.'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">File Type</h4>
                  <p className="mt-1">{document.file_type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                  <p className="mt-1">{new Date(document.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {document.analysis_result ? (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {document.analysis_result.summary && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Summary</h4>
                      <p className="text-sm">{document.analysis_result.summary}</p>
                    </div>
                  )}
                  
                  {document.analysis_result.key_points && document.analysis_result.key_points.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Key Points</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {document.analysis_result.key_points.map((point, index) => (
                          <li key={index} className="text-sm">{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-6">
                <div className="text-center text-muted-foreground">
                  <p>Analysis results will be available once processing is complete.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          {document.analysis_result?.risks && document.analysis_result.risks.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {document.analysis_result.risks.map((risk, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            risk.level === 'high' && "bg-red-100 text-red-800",
                            risk.level === 'medium' && "bg-yellow-100 text-yellow-800",
                            risk.level === 'low' && "bg-green-100 text-green-800"
                          )}
                        >
                          {risk.level} Risk
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{risk.description}</p>
                      {risk.recommendation && (
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Recommendation</h4>
                          <p className="text-sm">{risk.recommendation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-6">
                <div className="text-center text-muted-foreground">
                  <p>Risk assessment will be available once analysis is complete.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 