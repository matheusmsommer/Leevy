
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TestTube, Scan, Stethoscope, Scissors, UserCheck, HardHat, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  active: boolean;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string) => void;
  className?: string;
}

const getIconComponent = (iconName?: string) => {
  const iconMap = {
    'TestTube': TestTube,
    'Scan': Scan,
    'Stethoscope': Stethoscope,
    'Scissors': Scissors,
    'UserCheck': UserCheck,
    'HardHat': HardHat,
    'Settings': Settings,
  };
  
  const IconComponent = iconName ? iconMap[iconName as keyof typeof iconMap] : Settings;
  return IconComponent || Settings;
};

const CategorySelector = ({ categories, selectedCategoryId, onCategorySelect, className }: CategorySelectorProps) => {
  return (
    <div className={cn("grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2", className)}>
      {categories.map((category) => {
        const IconComponent = getIconComponent(category.icon);
        const isSelected = selectedCategoryId === category.id;
        
        return (
          <Card
            key={category.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md border-2 h-20",
              isSelected 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="p-2 text-center h-full flex flex-col justify-center items-center">
              <div className={cn(
                "mb-1 p-1.5 rounded-full w-fit transition-colors",
                isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                <IconComponent className="h-4 w-4" />
              </div>
              
              <h3 className={cn(
                "font-medium text-xs transition-colors line-clamp-2",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {category.name}
              </h3>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CategorySelector;
