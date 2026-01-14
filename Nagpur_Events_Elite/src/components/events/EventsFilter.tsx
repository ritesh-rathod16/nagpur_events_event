"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";

export function EventsFilter({ onFilterChange, onClose }: { onFilterChange: (filters: any) => void, onClose?: () => void }) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApply = () => {
    onFilterChange({
      search,
      location,
      categories,
      minPrice,
      maxPrice,
    });
    if (onClose) onClose();
  };

  const handleReset = () => {
    setSearch("");
    setLocation("all");
    setCategories([]);
    setMinPrice("");
    setMaxPrice("");
    onFilterChange({});
    if (onClose) onClose();
  };

  const toggleCategory = (cat: string) => {
    setCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="bg-white/5 border border-gold/10 p-6 rounded-xl sticky top-24">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-pearl font-poppins font-bold text-lg flex items-center gap-2">
          <Filter size={18} className="text-gold" /> Filters
        </h3>
        <Button 
          variant="ghost" 
          className="text-gold h-auto p-0 hover:bg-transparent" 
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>

      <div className="space-y-8">
        {/* Search */}
        <div className="space-y-3">
          <Label className="text-pearl/60 font-poppins text-[10px] tracking-widest uppercase">Search Events</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pearl/30" size={16} />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ex: Wedding, Tech Fest..." 
              className="bg-white/5 border-gold/10 text-pearl pl-10 focus:border-gold rounded-md"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <Label className="text-pearl/60 font-poppins text-[10px] tracking-widest uppercase">Location (Nagpur Areas)</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="bg-white/5 border-gold/10 text-pearl rounded-md">
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent className="bg-sapphire border-gold/20 text-pearl">
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="sadar">Sadar</SelectItem>
              <SelectItem value="civil-lines">Civil Lines</SelectItem>
              <SelectItem value="dharampeth">Dharampeth</SelectItem>
              <SelectItem value="wardha-road">Wardha Road</SelectItem>
              <SelectItem value="mihan">Mihan SEZ</SelectItem>
              <SelectItem value="sitabuldi">Sitabuldi</SelectItem>
              <SelectItem value="it-park">IT Park</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-3">
          <Label className="text-pearl/60 font-poppins text-[10px] tracking-widest uppercase">Category</Label>
          <div className="grid grid-cols-1 gap-3">
            {["Corporate", "Wedding", "Cultural", "Educational", "Exhibition"].map((cat) => (
              <div key={cat} className="flex items-center gap-3">
                <Checkbox 
                  id={cat} 
                  checked={categories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                  className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:text-sapphire" 
                />
                <label htmlFor={cat} className="text-pearl/70 text-sm font-inter cursor-pointer">{cat}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-pearl/60 font-poppins text-[10px] tracking-widest uppercase">Price Range (₹)</Label>
          <div className="flex items-center gap-3">
            <Input 
              type="number" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min" 
              className="bg-white/5 border-gold/10 text-pearl text-xs" 
            />
            <span className="text-pearl/30">-</span>
            <Input 
              type="number" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max" 
              className="bg-white/5 border-gold/10 text-pearl text-xs" 
            />
          </div>
        </div>

        <Button 
          onClick={handleApply}
          className="w-full bg-gold hover:bg-gold/90 text-sapphire font-poppins font-bold tracking-widest uppercase text-[10px] py-6 rounded-md"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
