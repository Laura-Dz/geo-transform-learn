// Backend Integration Demo - Test component to verify API connectivity
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Database } from 'lucide-react';
import { quizService, conceptService, achievementService } from '@/services';
import { useAuth } from '@/hooks/useAuth';

const BackendIntegrationDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | 'pending'>>({});
  const [data, setData] = useState<any>({});
  const { user } = useAuth();

  const runAPITests = async () => {
    setIsLoading(true);
    setTestResults({});
    setData({});

    const tests = [
      {
        name: 'Health Check',
        test: async () => {
          const response = await fetch('http://localhost:8080/api/health');
          return await response.json();
        }
      },
      {
        name: 'Get Quizzes',
        test: async () => {
          return await quizService.getQuizzes();
        }
      },
      {
        name: 'Get Concepts',
        test: async () => {
          return await conceptService.getConcepts();
        }
      },
      {
        name: 'Get Achievements',
        test: async () => {
          return await achievementService.getAchievements();
        }
      }
    ];

    for (const { name, test } of tests) {
      try {
        setTestResults(prev => ({ ...prev, [name]: 'pending' }));
        const result = await test();
        setTestResults(prev => ({ ...prev, [name]: 'success' }));
        setData(prev => ({ ...prev, [name]: result }));
      } catch (error) {
        console.error(`${name} failed:`, error);
        setTestResults(prev => ({ ...prev, [name]: 'error' }));
        setData(prev => ({ ...prev, [name]: error }));
      }
    }

    setIsLoading(false);
  };

  const getStatusIcon = (status: 'success' | 'error' | 'pending') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: 'success' | 'error' | 'pending') => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge variant="secondary">Testing...</Badge>;
      default:
        return <Badge variant="outline">Not tested</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Backend Integration Test
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Test the connection between frontend and backend services
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={runAPITests} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Run API Tests
          </Button>
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Test Results</h3>
            {Object.entries(testResults).map(([testName, status]) => (
              <div key={testName} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <span className="font-medium">{testName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(status)}
                  {data[testName] && status === 'success' && (
                    <span className="text-sm text-muted-foreground">
                      {Array.isArray(data[testName]) 
                        ? `${data[testName].length} items` 
                        : 'OK'
                      }
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data['Health Check'] && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Server Status</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(data['Health Check'], null, 2)}
            </pre>
          </div>
        )}

        {user && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Current User</h4>
            <p className="text-sm">
              <strong>Name:</strong> {user.name}<br />
              <strong>Email:</strong> {user.email}<br />
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BackendIntegrationDemo;
