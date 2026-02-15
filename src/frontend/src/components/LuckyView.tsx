import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles, HelpCircle, Zap, Info, Loader2, Camera, Image, Wand2, Film } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'lucky';
  timestamp: Date;
}

export default function LuckyView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Lucky, your friendly AI assistant! 🌟 How can I help you today?",
      sender: 'lucky',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const quickActions = [
    { icon: Camera, label: 'Camera Guide', query: 'How do I use the camera?' },
    { icon: Sparkles, label: 'Apply Filters', query: 'How do I apply filters?' },
    { icon: Wand2, label: 'AI Tools', query: 'Tell me about AI tools' },
    { icon: Film, label: 'Stories & Posts', query: 'How do I create stories?' },
  ];

  const getLuckyResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('camera')) {
      return "To use the Camera, navigate to the Camera window from the sidebar. You can capture photos and videos, switch between front and rear cameras, and your photos will automatically open in the Enhancement window! 📸 The camera supports both photo and video modes with professional controls.";
    } else if (lowerMessage.includes('filter') || lowerMessage.includes('enhance')) {
      return "Filters and enhancements are easy! After capturing a photo, it opens in the Enhance window where you can apply various filters from our collection of 3000+ creative filters, adjust brightness, contrast, and more. You can also access the Gallery to enhance existing photos! ✨";
    } else if (lowerMessage.includes('ai') || lowerMessage.includes('tool')) {
      return "Our AI Tools are powerful! They include Auto Enhance, Smart Effects, Sky Replacement, Color Pop, Style Transfer, Noise Reduction, Facial Refinement, and automated sky/light adjustments. Just select a photo from your Gallery and navigate to AI Tools! 🤖 All tools work seamlessly together.";
    } else if (lowerMessage.includes('feature') || lowerMessage.includes('what')) {
      return "Phonics has amazing features! 🎉 Camera capture with video recording, Gallery management, Advanced Editing, AI-powered enhancements, Stories & Posts with full interaction, Entertainment feed with real social features, Nearby 20 social discovery, and of course, me - Lucky, your AI assistant! Navigate through the sidebar to explore everything!";
    } else if (lowerMessage.includes('story') || lowerMessage.includes('stories')) {
      return "Stories let you share moments with 50k-80k reach! Create stories, view your own stories, discover nearby users' stories, like and comment on stories. Navigate to the Stories window to get started! 📱 Stories are fully interactive with real-time engagement.";
    } else if (lowerMessage.includes('entertainment')) {
      return "The Entertainment window is your hub for trending content! Discover popular posts, user stories, and interesting profiles. Like, comment, and share content to engage with the community! All interactions are fully functional! 🎬 You can also create your own posts.";
    } else if (lowerMessage.includes('profile')) {
      return "Your Profile is your personal space! Upload videos, create stories, manage posts, and showcase your content. Access it through the Profile icon in the sidebar! 👤 Your profile has elegant tabs for organizing all your content.";
    } else if (lowerMessage.includes('video') || lowerMessage.includes('record')) {
      return "Video recording is fully functional! Switch to video mode in the Camera window, press the record button to start, and press again to stop. Your videos are automatically saved to your Gallery and Profile! 🎥 You can also download recorded videos.";
    } else if (lowerMessage.includes('theme')) {
      return "You can customize the app's appearance with 5 beautiful themes! Go to Settings to choose from Neon Night, Sun Glow, Dreamscape, Ocean Breeze, or Sunset Vibes. Each theme instantly transforms the entire app! 🎨";
    } else if (lowerMessage.includes('gallery')) {
      return "The Gallery stores all your captured and enhanced media! You can search by tags, filter content, and perform actions like Edit, Enhance, AI Tools, Share, and Delete on any media item. 🖼️ All your creative work is organized here.";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! 👋 I'm Lucky, here to help you navigate Phonics and answer any questions. What would you like to know?";
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! 😊 I'm always here to help. Feel free to ask me anything about the app!";
    } else {
      return "That's a great question! I'm here to help you with anything related to Phonics - from using the camera and applying filters to understanding AI tools and navigating features. What specific aspect would you like to know more about? 💡";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      const luckyResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getLuckyResponse(messageText),
        sender: 'lucky',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, luckyResponse]);
      setIsProcessing(false);
    }, 800);
  };

  const handleQuickAction = (query: string) => {
    setInputValue(query);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6 premium-fade-glow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold premium-metallic-text flex items-center gap-3">
            <img 
              src="/assets/generated/lucky-chatbot-icon-transparent.dim_64x64.png" 
              alt="Lucky"
              className="w-10 h-10 premium-float"
            />
            Lucky - AI Assistant
          </h1>
          <p className="text-muted-foreground mt-2">
            Your friendly guide to Phonics features and help
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-primary to-secondary premium-neon-glow">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Chat Window */}
      <Card className="premium-glassmorphism-card depth-shadow-md">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary/40 premium-neon-glow">
              <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-lg">
                🍀
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Lucky</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Online & Ready to Help
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Messages */}
          <ScrollArea className="h-[450px] p-6" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} premium-slide-zoom`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white premium-neon-glow'
                        : 'context-chat-bubble'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="context-chat-bubble rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="px-6 py-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3 font-semibold">Quick Actions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.query)}
                    className="justify-start gap-2 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 hover:scale-105 premium-button-micro"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Lucky anything..."
                className="flex-1 rounded-full"
                disabled={isProcessing}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isProcessing}
                className="rounded-full bg-gradient-to-r from-primary to-secondary premium-neon-glow hover:scale-105 transition-all duration-300 premium-button-micro"
                size="icon"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

