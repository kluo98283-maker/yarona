import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from './Navbar';
import Footer from './Footer';
import ImageCompareSlider from './ImageCompareSlider';
import CTASection from './CTASection';

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  description: string;
  before_image_url: string;
  after_image_url: string;
  duration: string;
  features: string[];
  created_at: string;
}

function CasesPage() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  const categories = ['全部', '面部轮廓', '身体塑形', '注射提升', '植发', '牙齿美容'];

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = selectedCategory === '全部'
    ? cases
    : cases.filter(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-20 px-6 md:px-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-light mb-6 tracking-wide" style={{color: '#1F1F1F'}}>
              真实案例展示
            </h1>
            <p className="text-base md:text-lg tracking-wide mb-8" style={{color: '#6B7280'}}>
              见证每一次美丽蜕变
            </p>
            <button
              onClick={() => navigate('/booking')}
              className="px-10 py-3 text-white text-sm transition tracking-wider"
              style={{backgroundColor: '#1C2B3A'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#101D29'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1C2B3A'}
            >
              预约咨询
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-6 py-2 text-sm transition-all duration-300 border"
                style={{
                  color: selectedCategory === category ? 'white' : '#1F1F1F',
                  backgroundColor: selectedCategory === category ? '#1C2B3A' : 'white',
                  borderColor: selectedCategory === category ? '#1C2B3A' : '#E5E7EB'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.borderColor = '#1C2B3A';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg mb-8" style={{color: '#6B7280'}}>暂无案例</p>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 text-white text-sm transition"
                style={{backgroundColor: '#1C2B3A'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#101D29'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1C2B3A'}
              >
                返回首页
              </button>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredCases.map((caseStudy, index) => (
                <div key={caseStudy.id} className="bg-white border" style={{borderColor: '#E5E7EB'}}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="p-6 md:p-8 min-h-[500px] md:min-h-[600px] flex items-center">
                      <ImageCompareSlider
                        beforeImage={caseStudy.before_image_url}
                        afterImage={caseStudy.after_image_url}
                        altBefore={`${caseStudy.title} - 术前`}
                        altAfter={`${caseStudy.title} - 术后`}
                      />
                    </div>

                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="mb-4">
                        <span
                          className="inline-block px-4 py-1 text-xs font-light tracking-wider"
                          style={{backgroundColor: '#1C2B3A', color: 'white'}}
                        >
                          {caseStudy.category}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-light mb-4" style={{color: '#1F1F1F'}}>
                        案例 {String(index + 1).padStart(2, '0')}
                      </h3>
                      <h4 className="text-lg md:text-xl font-normal mb-4" style={{color: '#1F1F1F'}}>
                        {caseStudy.title}
                      </h4>
                      <p className="text-sm md:text-base leading-relaxed mb-6" style={{color: '#6B7280'}}>
                        {caseStudy.description}
                      </p>

                      {caseStudy.duration && (
                        <div className="mb-6 pb-6 border-b" style={{borderColor: '#E5E7EB'}}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-normal" style={{color: '#1F1F1F'}}>恢复时间：</span>
                            <span className="text-sm" style={{color: '#6B7280'}}>{caseStudy.duration}</span>
                          </div>
                        </div>
                      )}

                      {caseStudy.features && caseStudy.features.length > 0 && (
                        <div>
                          <p className="text-sm font-normal mb-4" style={{color: '#1F1F1F'}}>
                            主要改善效果
                          </p>
                          <div className="grid grid-cols-1 gap-3">
                            {caseStudy.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 p-3 bg-gray-50 border"
                                style={{borderColor: '#E5E7EB'}}
                              >
                                <span className="mt-1 text-sm" style={{color: '#1C2B3A'}}>●</span>
                                <span className="text-sm" style={{color: '#4B5563'}}>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />

      <Footer />
    </div>
  );
}

export default CasesPage;
