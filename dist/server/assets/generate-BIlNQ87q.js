import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { n as cn } from "./router-BX1vAgXZ.js";
import { Sparkles, Loader2, Download } from "lucide-react";
import { P as PageHeader } from "./PageHeader-DhYAk1c0.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "@tanstack/react-query-devtools";
import "react-dom";
import "zustand";
import "zustand/middleware";
import "zustand/shallow";
import "motion/react";
import "clsx";
import "tailwind-merge";
import "zod";
import "appwrite";
import "firebase/firestore";
import "firebase/app";
import "firebase/auth";
import "@emailjs/browser";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "embla-carousel-react";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Card = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, role: "alert", className: cn(alertVariants({ variant }), className), ...props }));
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "h5",
    {
      ref,
      className: cn("mb-1 font-medium leading-none tracking-tight", className),
      ...props
    }
  )
);
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("text-sm [&_p]:leading-relaxed", className), ...props }));
AlertDescription.displayName = "AlertDescription";
function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for your image");
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const imageUrl = `https://via.placeholder.com/512x512.png?text=${encodedPrompt}`;
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error("Image generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5" }),
        "AI Image Generator"
      ] }),
      /* @__PURE__ */ jsx(CardDescription, { children: "Describe what you want to create and AI will generate it for you" })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "A serene landscape with mountains and a lake at sunset...",
            value: prompt,
            onChange: (e) => setPrompt(e.target.value),
            onKeyPress: (e) => e.key === "Enter" && handleGenerateImage(),
            disabled: isGenerating
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleGenerateImage,
            disabled: isGenerating || !prompt.trim(),
            className: "w-full",
            children: isGenerating ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Generating..."
            ] }) : "Generate Image"
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx(Alert, { variant: "destructive", children: /* @__PURE__ */ jsx(AlertDescription, { children: error }) }),
      generatedImage && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "relative aspect-square w-full overflow-hidden rounded-lg border", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: generatedImage,
            alt: "Generated artwork",
            className: "w-full h-full object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleDownload, variant: "outline", className: "w-full", children: [
          /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" }),
          "Download Image"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Tips for better results:" }),
        /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-1", children: [
          /* @__PURE__ */ jsx("li", { children: "Be specific about colors, style, and mood" }),
          /* @__PURE__ */ jsx("li", { children: 'Include artistic references (e.g., "in the style of Van Gogh")' }),
          /* @__PURE__ */ jsx("li", { children: "Describe the composition and perspective" }),
          /* @__PURE__ */ jsx("li", { children: "Add details about lighting and atmosphere" })
        ] })
      ] })
    ] })
  ] });
}
function GeneratePage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "AI Art Generator", description: "Create unique artworks using artificial intelligence" }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto py-8 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold", children: "Transform Your Ideas Into Art" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground max-w-2xl mx-auto", children: "Describe your vision and watch as AI brings it to life. From abstract concepts to detailed scenes, our AI can generate stunning artwork based on your prompts." })
      ] }),
      /* @__PURE__ */ jsx(ImageGenerator, {}),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: "How It Works" }),
          /* @__PURE__ */ jsxs("ol", { className: "list-decimal list-inside space-y-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsx("li", { children: "Enter a detailed description of what you want to create" }),
            /* @__PURE__ */ jsx("li", { children: 'Click "Generate Image" to start the AI process' }),
            /* @__PURE__ */ jsx("li", { children: "Wait a few seconds while the AI creates your artwork" }),
            /* @__PURE__ */ jsx("li", { children: "Download your generated image or try again with a new prompt" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: "Example Prompts" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
              /* @__PURE__ */ jsx("span", { children: '"A vibrant sunset over a futuristic city with flying cars"' })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
              /* @__PURE__ */ jsx("span", { children: '"Abstract painting with swirling colors in the style of Van Gogh"' })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
              /* @__PURE__ */ jsx("span", { children: '"Mystical forest with glowing mushrooms and fairy lights"' })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: "•" }),
              /* @__PURE__ */ jsx("span", { children: '"Portrait of a cyberpunk warrior with neon accents"' })
            ] })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  GeneratePage as component
};
