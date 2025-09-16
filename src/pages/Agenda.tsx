import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

const Agenda = () => {
  const venueASchedule = [
    {
      time: "09:00-09:30",
      title: "Registration and welcome coffee",
      description: "Attendees can begin exploring the Fair & Showcase Zone"
    },
    {
      time: "09:30-09:45",
      title: "Opening Keynote",
      description: "Opening remarks from the host university and organizing team, introducing the summit's goals"
    },
    {
      time: "09:45-10:30",
      title: "Panel discussion",
      description: "The Next Decade of Immersive Technologies"
    },
    {
      time: "10:30-11:30",
      title: "Panel discussion",
      description: "Preparing for the Workforce of Tomorrow: How Tech Companies Can Engage and Empower Gen-Z"
    },
    {
      time: "11:30-12:30",
      title: "Panel discussion",
      description: "Preparing Generation Z for Leadership in Emerging Technologies"
    },
    {
      time: "12:30-13:30",
      title: "Lunch break",
      description: "Lunch break, with networking across all spaces"
    },
    {
      time: "13:30-14:30",
      title: "Fireside chat",
      description: "The Entrepreneurial Mindset for Gen Z, showcasing lessons from young founders"
    },
    {
      time: "14:30-15:30",
      title: "Fireside chat",
      description: "The Entrepreneurial Mindset: What Tech Leaders Look for in the Next Generation of Founders"
    },
    {
      time: "15:30-16:30",
      title: "Gen Z Future Leaders Spotlight and Lightning Talks",
      description: "Inspiring stories and bold ideas from student society presidents, young entrepreneurs, and thought leaders"
    },
    {
      time: "16:30-17:00",
      title: "Ideathon Pitch Showcase and Awards",
      description: "Teams from Venue B present their solutions to a panel of judges"
    },
    {
      time: "17:00-18:00",
      title: "Closing remarks and networking reception",
      description: "Celebrating the day's connections and collaborations"
    }
  ];

  const venueBActivities = [
    {
      title: "From 09:30 - the all-day Ideathon Gen Z Co-Creates the Future begins",
      description: "Teams work on real-world challenges with guidance from expert mentors, culminating in pitches in Venue A"
    },
    {
      title: "All day - attendees can experience the Immersive Experience Pods",
      description: "Trying out the latest VR, AR, and AI creative tools"
    },
    {
      title: "Contribute thoughts and creativity to the evolving Creative Collaboration Wall",
      description: "They will be updated at the end of the day"
    },
    {
      title: "Take part in Networking Zones",
      description: "With themed tables rotating every 20 minutes, fostering connections between students, founders, recruiters, and professionals"
    },
    {
      title: "Join the Reverse Mentoring Tables",
      description: "At this space, Gen Z attendees mentor senior professionals, offering their expectations, insights, and values"
    },
    {
      title: "Between 10:00 and 12:30 - Lightning Learning Bites",
      description: "Drop in for Lightning Learning Bites, short, informal sessions on emerging topics in immersive technology, creativity, and wellbeing"
    },
    {
      title: "From 13:30 to 15:30 - Join Interactive Co-Design Workshops",
      description: "Collaborating to create ethical, inclusive, and sustainable tech concepts"
    },
    {
      title: "Book a slot any time - Meet the Mentors Corner",
      description: "Sign into the Meet the Mentors Corner for exclusive one-on-one mentoring on careers and entrepreneurship"
    },
    {
      title: "At 15:30 - Final Touches & Creative Collaboration Wall Reveal",
      description: "Ideathon teams put finishing touches on their pitches and the Creative Collaboration Wall is revealed before moving to Venue A for the final showcase"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-genz-blue via-genz-purple to-genz-green">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Event <span className="text-genz-yellow">Agenda</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            One day of cutting-edge sessions, workshops, and networking opportunities 
            designed to shape the future of technology and innovation.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-white">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <Calendar className="w-5 h-5 text-genz-yellow" />
              <span className="font-semibold">27 October 2025</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <Clock className="w-5 h-5 text-genz-yellow" />
              <span className="font-semibold">10:00 - 18:00 GMT+1</span>
            </div>
          </div>
        </div>
      </section>

      {/* Venue A Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Button className="bg-genz-blue hover:bg-genz-purple text-white font-semibold px-8 py-3 mb-6">
              Venue A
            </Button>
            <h2 className="text-4xl font-bold text-white mb-4">
              Venue A: Main Auditorium – Speeches & Voices
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              The Main Auditorium will host the keynote sessions, panels, 
              lightning talks, open mic, and the ideathon showcase, 
              providing inspiration and insight throughout the day.
            </p>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="space-y-6">
                {venueASchedule.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-3 h-3 rounded-full bg-genz-blue flex-shrink-0 mt-2"></div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <span className="font-bold text-genz-blue text-lg">{item.time}</span>
                        <span className="text-gray-400">–</span>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Venue B Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Button className="bg-genz-green hover:bg-genz-yellow text-white font-semibold px-8 py-3 mb-6">
              Venue B
            </Button>
            <h2 className="text-4xl font-bold text-white mb-4">
              Venue B: Collaboration & Networking Hall – Action & Engagement
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Venue B is a fully active, interactive space throughout the 
              day, designed for hands-on learning, idea generation, and 
              meaningful connections.
            </p>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="space-y-6">
                {venueBActivities.map((activity, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-3 h-3 rounded-full bg-genz-green flex-shrink-0 mt-2"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{activity.title}</h3>
                      <p className="text-gray-600">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Don't Miss Out!
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Secure your spot at the most exciting Gen Z tech event of the year. 
            Early bird pricing ends soon!
          </p>
          
          <div className="flex justify-center">
            <Button 
              className="bg-genz-yellow hover:bg-genz-orange text-navy font-bold px-8 py-3 text-lg"
              onClick={() => window.open('https://lu.ma/qkiufx1n', '_blank')}
            >
              Register Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Agenda;