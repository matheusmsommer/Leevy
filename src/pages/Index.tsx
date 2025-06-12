
import React, { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Search, MapPin, Clock, Building2, Phone, Users, TestTube } from 'lucide-react';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

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

  // Mock data dos laboratórios
  const laboratories = [
    {
      id: 'lab1',
      name: 'Laboratório Central',
      rating: 4.8,
      reviewCount: 127,
      city: 'São Paulo',
      district: 'Centro',
      phone: '(11) 3456-7890',
      specialties: ['Análises Clínicas', 'Imagem'],
      examCount: 150,
      price_range: 'R$ 25 - R$ 200',
      popular_exams: ['Hemograma', 'Glicemia', 'Colesterol'],
      image: '/placeholder.svg'
    },
    {
      id: 'lab2',
      name: 'Lab Vida Diagnósticos',
      rating: 4.6,
      reviewCount: 89,
      city: 'São Paulo',
      district: 'Vila Madalena',
      phone: '(11) 2345-6789',
      specialties: ['Análises Clínicas', 'Cardiologia'],
      examCount: 120,
      price_range: 'R$ 30 - R$ 180',
      popular_exams: ['TSH', 'Ecocardiograma', 'Holter'],
      image: '/placeholder.svg'
    },
    {
      id: 'lab3',
      name: 'Diagnóstico Rápido',
      rating: 4.7,
      reviewCount: 156,
      city: 'Rio de Janeiro',
      district: 'Copacabana',
      phone: '(21) 3456-7890',
      specialties: ['Análises Clínicas', 'Imagem', 'Ultrassom'],
      examCount: 200,
      price_range: 'R$ 20 - R$ 250',
      popular_exams: ['Raio-X', 'Ultrassom', 'Ressonância'],
      image: '/placeholder.svg'
    },
    {
      id: 'lab4',
      name: 'Centro de Análises Médicas',
      rating: 4.5,
      reviewCount: 234,
      city: 'Belo Horizonte',
      district: 'Savassi',
      phone: '(31) 3456-7890',
      specialties: ['Análises Clínicas', 'Hormônios'],
      examCount: 95,
      price_range: 'R$ 35 - R$ 160',
      popular_exams: ['Hemograma', 'Hormônios', 'Vitaminas'],
      image: '/placeholder.svg'
    }
  ];

  const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'];
  const specialties = ['Análises Clínicas', 'Imagem', 'Cardiologia', 'Ultrassom', 'Hormônios'];

  const filteredLabs = laboratories.filter(lab => {
    const matchesSearch = lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.popular_exams.some(exam => exam.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = selectedCity === 'all' || lab.city === selectedCity;
    const matchesSpecialty = selectedSpecialty === 'all' || lab.specialties.includes(selectedSpecialty);
    
    return matchesSearch && matchesCity && matchesSpecialty;
  });

  const handleViewLab = (labId: string) => {
    navigate(`/company/${labId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">leevy</div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-blue-600 font-medium">
              Laboratórios
            </a>
            <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              Sobre
            </a>
          </nav>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <a href="/login" className="font-semibold">Entrar</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Encontre o melhor <span className="text-blue-600">laboratório</span> para seus exames
            </h1>
            <p className="text-xl text-gray-600">
              Compare preços, agende online e pague com segurança. Tudo em um só lugar.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar laboratórios ou exames (ex: hemograma, ultrassom...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="py-3">
                  <SelectValue placeholder="Especialidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as especialidades</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCity('all');
                  setSelectedSpecialty('all');
                }}
                className="py-3"
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Laboratory Listings */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Laboratórios disponíveis
            </h2>
            <p className="text-gray-600">
              {filteredLabs.length} laboratórios encontrados
            </p>
          </div>

          {filteredLabs.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum laboratório encontrado com os filtros selecionados</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredLabs.map((lab) => (
                <Card key={lab.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewLab(lab.id)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-900">{lab.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium text-gray-900">{lab.rating}</span>
                              <span className="text-gray-500">({lab.reviewCount})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {lab.examCount} exames
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{lab.district}, {lab.city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{lab.phone}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Especialidades:</p>
                        <div className="flex flex-wrap gap-2">
                          {lab.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Exames populares:</p>
                        <div className="flex flex-wrap gap-2">
                          {lab.popular_exams.map((exam) => (
                            <Badge key={exam} variant="outline" className="text-xs">
                              {exam}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-sm text-gray-600">Faixa de preços</p>
                          <p className="font-semibold text-gray-900">{lab.price_range}</p>
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
          )}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Laboratórios parceiros</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Tipos de exames</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">24h</div>
              <div className="text-gray-600">Agendamento online</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Seguro e confiável</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
