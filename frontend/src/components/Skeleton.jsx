const FormSkeleton = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-lg">
      {/* Name Field Skeleton */}
      <div className="mb-6">
        <div className="h-4 bg-neutral-300 rounded w-16 mb-3 animate-pulse"></div>
        <div className="h-12 bg-neutral-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Shop Image Field Skeleton */}
      <div className="mb-6">
        <div className="h-4 bg-neutral-300 rounded w-24 mb-3 animate-pulse"></div>
        <div className="h-12 bg-neutral-200 rounded-lg animate-pulse mb-4"></div>
        
        {/* Image Preview Skeleton */}
        <div className="flex gap-4">
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-neutral-300 rounded-lg animate-pulse flex-shrink-0"></div>
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-primary-200 via-cream-200 to-sage-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* City and State Fields Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="h-4 bg-neutral-300 rounded w-8 mb-3 animate-pulse"></div>
          <div className="h-12 bg-neutral-200 rounded-lg animate-pulse"></div>
        </div>
        <div>
          <div className="h-4 bg-neutral-300 rounded w-10 mb-3 animate-pulse"></div>
          <div className="h-12 bg-neutral-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Address Field Skeleton */}
      <div className="mb-6">
        <div className="h-4 bg-neutral-300 rounded w-14 mb-3 animate-pulse"></div>
        <div className="h-12 bg-neutral-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Submit Button Skeleton */}
      <div className="flex justify-center mt-8">
        <div className="h-12 bg-primary-300 rounded-lg w-32 animate-pulse"></div>
      </div>
    </div>
  );
};      

export default FormSkeleton;