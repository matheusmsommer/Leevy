
import React, { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Search, MapPin, Building2 } from 'lucide-react';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Mock data simplificado
  const laboratories = [
    {
      id: 'lab1',
      name: 'Laboratório Central',
      rating: 4.8,
      reviewCount: 127,
      city: 'São Paulo',
      district: 'Centro',
      examCount: 150,
      price_range: 'R$ 25 - R$ 200',
      popular_exams: ['Hemograma', 'Glicemia', 'Colesterol']
    },
    {
      id: 'lab2',
      name: 'Lab Vida Diagnósticos',
      rating: 4.6,
      reviewCount: 89,
      city: 'São Paulo',
      district: 'Vila Madalena',
      examCount: 120,
      price_range: 'R$ 30 - R$ 180',
      popular_exams: ['TSH', 'Ecocardiograma', 'Holter']
    },
    {
      id: 'lab3',
      name: 'Diagnóstico Rápido',
      rating: 4.7,
      reviewCount: 156,
      city: 'Rio de Janeiro',
      district: 'Copacabana',
      examCount: 200,
      price_range: 'R$ 20 - R$ 250',
      popular_exams: ['Raio-X', 'Ultrassom', 'Ressonância']
    }
  ];

  const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'];

  const filteredLabs = laboratories.filter(lab => {
    const matchesSearch = lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.popular_exams.some(exam => exam.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = selectedCity === 'all' || lab.city === selectedCity;
    
    return matchesSearch && matchesCity;
  });

  const handleViewLab = (labId: string) => {
    navigate(`/company/${labId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simplificado */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">leevy</div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <a href="/login">Entrar</a>
          </Button>
        </div>
      </header>

      {/* Busca principal */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Encontre laboratórios e agende seus exames
            </h1>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar laboratórios ou exames..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 text-lg"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="py-3">
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCity('all');
                }}
                className="py-3"
              >
                Limpar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de laboratórios simplificada */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLabs.map((lab) => (
              <Card key={lab.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewLab(lab.id)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{lab.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{lab.rating}</span>
                            <span className="text-sm text-gray-500">({lab.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{lab.district}, {lab.city}</span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Exames populares:</p>
                      <div className="flex flex-wrap gap-1">
                        {lab.popular_exams.map((exam) => (
                          <Badge key={exam} variant="outline" className="text-xs">
                            {exam}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{lab.price_range}</p>
                        <p className="text-sm text-gray-500">{lab.examCount} exames disponíveis</p>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Ver Exames
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
