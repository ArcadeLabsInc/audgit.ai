import { useEffect, useState } from "react"
import NDK, {
    NDKEvent, NDKPrivateKeySigner, NDKSubscription
} from "@nostr-dev-kit/ndk"
import { DocumentRowSkeleton } from "../components/Documents"
import { PlusIcon } from "../icons"
import { MarketingLayout } from "../layouts/Marketing"
import { RELAYS, useNDK } from "../lib/client/hooks/state"
import { Button } from "../primitives/Button"
import { Input } from "../primitives/Input"

import type { NostrEvent } from "@nostr-dev-kit/ndk";
export default function Audit() {
  const { ndk, setNDK } = useNDK();
  const [userInput, setUserInput] = useState<string>(
    "https://github.com/ArcadeLabsInc/arcade/issues/447"
  );
  const [eventFeed, setEventFeed] = useState<NDKEvent[]>([]);
  const [sub, setSub] = useState<NDKSubscription | null>(null);

  useEffect(() => {
    console.log("eventFeed", eventFeed);
  }, [eventFeed]);

  useEffect(() => {
    try {
      const signer = NDKPrivateKeySigner.generate();
      const ndk = new NDK({
        explicitRelayUrls: RELAYS,
        signer,
      });

      ndk.pool.on("relay:connect", async (r: any) => {
        console.log(`Connected to a relay ${r.url}`);
      });

      ndk.connect(2500);

      setNDK(ndk);
    } catch (e) {
      console.log("error", e);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!userInput || !ndk) return;
    e.preventDefault();
    console.log("userInput", userInput);

    const event = new NDKEvent(ndk, {
      kind: 65006,
      tags: [
        ["j", "code-review"], // This is what the existing code review bot is looking for
        // ["j", "issue-review"], // This is what we can do to avoid collision
        ["bid", "10000"],
      ],
      content: userInput,
    } as NostrEvent);

    await event.sign();

    // check if there is a subscription running here
    if (sub !== null) {
      console.log("already subscribed");
      sub.stop();
    }

    // create a subscription
    const newSub = ndk?.subscribe(
      {
        ...event.filter(),
      },
      { closeOnEose: false, groupable: false }
    );
    newSub!.on("event", (event: NDKEvent) => {
      // add event to event feed
      setEventFeed((prevEventFeed) => [event, ...prevEventFeed]);
    });
    setSub(newSub!);

    await event.publish();
  };

  return (
    <MarketingLayout>
      <div
        style={{
          backgroundColor: "#121215",
          height: "100vh",
          width: "100vw",
          padding: 40,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "row",
            placeItems: "center",
            justifyContent: "center",
          }}
        >
          <Input
            placeholder="Enter a GitHub issue URL"
            style={{
              minWidth: 500,
              padding: 24,
              borderRadius: 8,
              marginRight: 12,
            }}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button
            icon={<PlusIcon />}
            type="submit"
            style={{ padding: 24, borderRadius: 8 }}
          >
            Submit
          </Button>
        </form>

        <div style={{ marginTop: 30, maxWidth: 660 }}>
          {eventFeed.map((event) => {
            let date = "unknown";

            if (event.created_at) {
              const timeOptions = {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              };

              date = new Date(event.created_at * 1000).toLocaleString(
                "en-US",
                // @ts-ignore
                timeOptions
              );
            }

            return (
              <div
                key={event.id}
                style={{
                  backgroundColor: "#444",
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 10,
                }}
              >
                <p
                  style={{
                    textAlign: "right",
                    marginBottom: 2,
                    color: "#999",
                    fontSize: 14,
                  }}
                >
                  {date}
                </p>
                <p>{event.content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </MarketingLayout>
  );
}
