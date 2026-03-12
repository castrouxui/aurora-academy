"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

export const InfiniteMovingCards = ({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    className,
}: {
    items: {
        content: string;
        name: string;
        description: string;
        image: string;
        rating: number;
        courseId?: string; // Optional if we want to link or mention the course
    }[];
    direction?: "left" | "right";
    speed?: "fast" | "normal" | "slow";
    pauseOnHover?: boolean;
    className?: string;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollerRef = useRef<HTMLUListElement>(null);

    const [start, setStart] = useState(false);

    useEffect(() => {
        addAnimation();
    }, []);

    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
            setStart(true);
        }
    }

    const getDirection = () => {
        if (containerRef.current) {
            if (direction === "left") {
                containerRef.current.style.setProperty("--animation-direction", "forwards");
            } else {
                containerRef.current.style.setProperty("--animation-direction", "reverse");
            }
        }
    };

    const getSpeed = () => {
        if (containerRef.current) {
            if (speed === "fast") {
                containerRef.current.style.setProperty("--animation-duration", "20s");
            } else if (speed === "normal") {
                containerRef.current.style.setProperty("--animation-duration", "40s");
            } else {
                containerRef.current.style.setProperty("--animation-duration", "80s");
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
                className
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
                    start && "animate-scroll",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
            >
                {items.map((item, idx) => (
                    <li
                        className="w-[350px] max-w-full relative rounded-2xl border border-border shrink-0 bg-card p-6 md:w-[450px]"
                        key={item.name + idx}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border/50">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground text-sm">{item.name}</h4>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                        </div>

                        <div className="flex gap-0.5 mb-3">
                            {[...Array(item.rating)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                            ))}
                        </div>

                        <p className="text-sm text-foreground/80 leading-relaxed italic line-clamp-4">
                            &ldquo;{item.content}&rdquo;
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
