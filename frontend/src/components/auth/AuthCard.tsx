import {ReactNode} from 'react';

import {Cloud} from 'lucide-react';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@components/ui/card';

interface AuthCardProps {
  children: ReactNode;
  description: string;
}

export const AuthCard = ({children, description}: AuthCardProps) => {
  return (
    <Card className="w-full min-w-[350px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center flex items-center justify-center">
          <Cloud className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-bold text-blue-600">WeatherApp</h1>
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
