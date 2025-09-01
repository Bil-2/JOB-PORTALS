import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, MapPin, Briefcase, DollarSign, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, FormField } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useSearchJobsQuery } from '../../store/api/jobApi';
import { setSearchFilters, selectSearchFilters } from '../../store/slices/uiSlice';
import { debounce } from '../../lib/utils';

const JobSearch = ({ onJobSelect }) => {
  const dispatch = useDispatch();
  const filters = useSelector(selectSearchFilters);
  const [localQuery, setLocalQuery] = useState(filters.query);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = debounce((query) => {
    dispatch(setSearchFilters({ query }));
  }, 500);

  const { data, isLoading, error } = useSearchJobsQuery({
    query: filters.query,
    filters: {
      category: filters.category,
      location: filters.location,
      salaryMin: filters.salaryRange[0],
      salaryMax: filters.salaryRange[1],
      jobType: filters.jobType,
      experience: filters.experience,
    },
  });

  useEffect(() => {
    debouncedSearch(localQuery);
  }, [localQuery, debouncedSearch]);

  const handleFilterChange = (key, value) => {
    dispatch(setSearchFilters({ [key]: value }));
  };

  const clearFilters = () => {
    dispatch(setSearchFilters({
      query: '',
      category: '',
      location: '',
      salaryRange: [0, 200000],
      jobType: '',
      experience: '',
    }));
    setLocalQuery('');
  };

  const jobCategories = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
    'Sales', 'Design', 'Engineering', 'Human Resources', 'Operations'
  ];

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search jobs by title, company, or keywords..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="pl-10 pr-12 h-12 text-lg"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Advanced Filters
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField label="Category">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="">All Categories</option>
                  {jobCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Location">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="City, State, or Remote"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </FormField>

              <FormField label="Job Type">
                <select
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="">All Types</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Experience Level">
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="">All Levels</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Salary Range">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      ${filters.salaryRange[0].toLocaleString()} - ${filters.salaryRange[1].toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="5000"
                    value={filters.salaryRange[1]}
                    onChange={(e) => handleFilterChange('salaryRange', [filters.salaryRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </FormField>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <p className="text-destructive">Error loading jobs. Please try again.</p>
            </CardContent>
          </Card>
        )}

        {data?.jobs && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {data.jobs.length} jobs found
              </p>
            </div>

            {data.jobs.map((job) => (
              <Card key={job._id} className="job-card cursor-pointer" onClick={() => onJobSelect?.(job)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {job.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span>{job.category}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.city}, {job.country}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{new Date(job.jobPostedOn).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {job.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                          <span className="font-medium text-green-600">
                            {job.fixedSalary
                              ? `$${job.fixedSalary.toLocaleString()}`
                              : `$${job.salaryFrom?.toLocaleString()} - $${job.salaryTo?.toLocaleString()}`
                            }
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
