import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  recommendSnowboard,
  SnowboardRecommendationType,
  UserInputforSkiRecommendationSchema,
  UserInputforSnowboardRecommendationSchema,
} from "@/lib/recommendation.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type SnowboardFormInputs = z.infer<
  typeof UserInputforSnowboardRecommendationSchema
>;
type SkiFormInputs = z.infer<typeof UserInputforSkiRecommendationSchema>;

const GearRecommendationForm = ({
  setSnowboardRecommendation,
}: {
  setSnowboardRecommendation: React.Dispatch<
    React.SetStateAction<SnowboardRecommendationType | null>
  >;
}) => {
  const snowboardForm = useForm<SnowboardFormInputs>({
    resolver: zodResolver(UserInputforSnowboardRecommendationSchema),
    defaultValues: {
      height: 0,
      weight: 0,
      gender: "male",
      skillLevel: "beginner",
      ridingStyle: "all-mountain",
    },
  });

  const skiForm = useForm<SkiFormInputs>({
    resolver: zodResolver(UserInputforSkiRecommendationSchema),
    defaultValues: {
      height: 0,
      weight: 0,
      gender: "male",
      skillLevel: "beginner",
      skiingStyle: "all-mountain",
    },
  });

  const onSnowboardSubmit: SubmitHandler<SnowboardFormInputs> = (data) => {
    const result = recommendSnowboard(data);

    if (result) {
      setSnowboardRecommendation(result);
    }
    // Here you would typically send this data to your recommendation algorithm
  };

  const onSkiSubmit: SubmitHandler<SkiFormInputs> = (data) => {
    console.log("Ski recommendation for:", data);
    // Here you would typically send this data to your recommendation algorithm
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Gear Recommendation</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="snowboard">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="snowboard">Snowboard</TabsTrigger>
            <TabsTrigger value="ski">Ski</TabsTrigger>
          </TabsList>
          <TabsContent value="snowboard">
            <Form {...snowboardForm}>
              <form
                onSubmit={snowboardForm.handleSubmit(onSnowboardSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={snowboardForm.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={snowboardForm.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={snowboardForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={snowboardForm.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select skill level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={snowboardForm.control}
                  name="ridingStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Riding Style</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select riding style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="freestyle">Freestyle</SelectItem>
                          <SelectItem value="all-mountain">
                            All-Mountain
                          </SelectItem>
                          <SelectItem value="powder">Powder</SelectItem>
                          <SelectItem value="backcountry">
                            Backcountry
                          </SelectItem>
                          <SelectItem value="splitboard">Splitboard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Get Snowboard Recommendation</Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="ski">
            <Form {...skiForm}>
              <form
                onSubmit={skiForm.handleSubmit(onSkiSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={skiForm.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={skiForm.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={skiForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={skiForm.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select skill level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={skiForm.control}
                  name="skiingStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skiing Style</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select skiing style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all-mountain">
                            All-Mountain
                          </SelectItem>
                          <SelectItem value="powder">Powder</SelectItem>
                          <SelectItem value="park">Park & Pipe</SelectItem>
                          <SelectItem value="racing">Racing</SelectItem>
                          <SelectItem value="touring">Touring</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Get Ski Recommendation</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Fill in all fields for the best recommendation.
      </CardFooter>
    </Card>
  );
};

export default GearRecommendationForm;
