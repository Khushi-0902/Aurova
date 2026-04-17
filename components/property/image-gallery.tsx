'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Grid3X3, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PropertyImage } from '@/lib/property-data'

interface ImageGalleryProps {
  images: PropertyImage[]
  propertyName: string
}

const sectionLabels: Record<string, string> = {
  'hero': 'Featured',
  'common-area': 'Common Area',
  'kitchen': 'Kitchen',
  'room-1': 'Room 1',
  'room-2': 'Room 2',
  'room-3': 'Room 3',
  'room-4': 'Room 4',
  'washroom-1': 'Bathroom 1',
  'washroom-2': 'Bathroom 2',
  'washroom-3': 'Bathroom 3',
  'washroom-4': 'Bathroom 4',
  'exterior': 'Exterior',
}

export function ImageGallery({ images, propertyName }: ImageGalleryProps) {
  const [showFullGallery, setShowFullGallery] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState<string>('all')

  const heroImage = images.find((img) => img.section === 'hero') || images[0]
  const previewImages = images.slice(1, 5)

  const sections = ['all', ...Array.from(new Set(images.map((img) => img.section)))]
  const filteredImages = activeSection === 'all' 
    ? images 
    : images.filter((img) => img.section === activeSection)

  // Safety: ensure selectedImage is within bounds
  const safeSelectedImage = selectedImage !== null && selectedImage < filteredImages.length 
    ? selectedImage 
    : null
  
  const currentImage = safeSelectedImage !== null ? filteredImages[safeSelectedImage] : null

  const handlePrevious = () => {
    if (safeSelectedImage !== null && filteredImages.length > 0) {
      setSelectedImage(safeSelectedImage === 0 ? filteredImages.length - 1 : safeSelectedImage - 1)
    }
  }

  const handleNext = () => {
    if (safeSelectedImage !== null && filteredImages.length > 0) {
      setSelectedImage(safeSelectedImage === filteredImages.length - 1 ? 0 : safeSelectedImage + 1)
    }
  }

  return (
    <>
      {/* Hero Gallery Grid */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[300px] md:h-[500px] rounded-2xl overflow-hidden">
          {/* Main large image */}
          <div 
            className="md:col-span-2 md:row-span-2 relative cursor-pointer group"
            onClick={() => {
              setShowFullGallery(true)
              setSelectedImage(null) // Open in grid view
            }}
          >
            <Image
              src={heroImage.url}
              alt={heroImage.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="size-5 text-primary-foreground" />
              <span className="text-primary-foreground font-medium">View larger</span>
            </div>
          </div>

          {/* Preview images */}
          {previewImages.map((image) => (
            <div
              key={image.id}
              className="relative cursor-pointer group hidden md:block"
              onClick={() => {
                setShowFullGallery(true)
                setSelectedImage(null) // Open in grid view
              }}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
              <span className="absolute bottom-2 left-2 text-xs font-medium text-primary-foreground bg-foreground/50 px-2 py-1 rounded-full backdrop-blur-sm">
                {sectionLabels[image.section] || image.section}
              </span>
            </div>
          ))}
        </div>

        {/* View all button */}
        <Button
          variant="secondary"
          className="absolute bottom-4 right-4 shadow-lg gap-2"
          onClick={() => setShowFullGallery(true)}
        >
          <Grid3X3 className="size-4" />
          View all {images.length} photos
        </Button>
      </div>

      {/* Full Gallery Modal */}
      {showFullGallery && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="font-serif text-xl font-semibold">{propertyName}</h2>
                <p className="text-sm text-muted-foreground">{images.length} photos</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowFullGallery(false)
                  setSelectedImage(null)
                }}
              >
                <X className="size-5" />
                <span className="sr-only">Close gallery</span>
              </Button>
            </div>

            {/* Section filters */}
            <div className="flex gap-2 p-4 overflow-x-auto border-b">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    setActiveSection(section)
                    setSelectedImage(null) // Reset to grid view when switching sections
                  }}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                    activeSection === section
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                  )}
                >
                  {section === 'all' ? 'All Photos' : sectionLabels[section] || section}
                </button>
              ))}
            </div>

            {/* Gallery content */}
            {currentImage ? (
              /* Lightbox view */
              <div className="flex-1 flex items-center justify-center relative p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-10"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="size-6" />
                  <span className="sr-only">Previous image</span>
                </Button>

                <div className="relative h-full w-full max-w-5xl">
                  <Image
                    src={currentImage.url}
                    alt={currentImage.alt}
                    fill
                    className="object-contain"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-10"
                  onClick={handleNext}
                >
                  <ChevronRight className="size-6" />
                  <span className="sr-only">Next image</span>
                </Button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <span className="bg-secondary/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                    {sectionLabels[currentImage.section] || currentImage.section} - {(safeSelectedImage ?? 0) + 1} / {filteredImages.length}
                  </span>
                </div>
              </div>
            ) : (
              /* Grid view */
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                      <span className="absolute bottom-2 left-2 text-xs font-medium text-primary-foreground bg-foreground/50 px-2 py-1 rounded-full backdrop-blur-sm">
                        {sectionLabels[image.section] || image.section}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
