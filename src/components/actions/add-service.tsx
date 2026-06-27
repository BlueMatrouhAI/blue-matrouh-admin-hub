import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useAreas } from "@/hooks/useAreas";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import httpClient from "@/lib/http-client";
import { useQueryClient } from "@tanstack/react-query";

const FeatureSchema = z.object({
  featureCategoryId: z.number(),
  value: z.union([z.number().nonnegative(), z.boolean(), z.array(z.string())]),
});

const Schema = z.object({
  serviceCatId: z.string().nonempty(),
  areaId: z.string().nonempty(),
  title: z.string().nonempty(),
  location: z.string().nonempty(),
  price: z.number().nonnegative(),
  description: z.string().nonempty(),
  features: z.array(FeatureSchema),
});

type FormValues = z.infer<typeof Schema>;

const AddService = () => {
  const categories = useCategories();
  const areas = useAreas();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [catId, setCatId] = useState("");
  const [input, setInput] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors,isLoading,isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: "",
      price: 0,
      description: "",
      features: [],
      location: "",
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
      setSelectedImages([]);
      setCatId("");
      setInput("");
    }
  }, [open]);

  const features = watch("features");

  const setFeatureValue = (
    featureCategoryId: number,
    value: number | boolean,
  ) => {
    const next = features.filter(
      (f) => f.featureCategoryId !== featureCategoryId,
    );

    setValue("features", [...next, { featureCategoryId, value }]);
  };

  const addFeatureItem = (featureCategoryId: number, item: string) => {
    const feature = features.find(
      (f) => f.featureCategoryId === featureCategoryId,
    );

    const items = feature && Array.isArray(feature.value) ? feature.value : [];

    const next = features.filter(
      (f) => f.featureCategoryId !== featureCategoryId,
    );

    setValue("features", [
      ...next,
      {
        featureCategoryId,
        value: [...items, item],
      },
    ]);
  };

  const qc = useQueryClient();

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("serviceCatId", data.serviceCatId);
      formData.append("areaId", data.areaId);
      formData.append("title", data.title);
      formData.append("location", data.location);
      formData.append("price", String(data.price));
      formData.append("description", data.description);
      formData.append("features", JSON.stringify(data.features));
      selectedImages.forEach((file) => {
        formData.append("images", file);
      });
      await httpClient.post("/services", formData);
      qc.invalidateQueries({queryKey:["services",data.serviceCatId]})
      reset();
      setSelectedImages([]);
      setCatId("");
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const selectedCategory = categories.data?.find((c) => c._id === catId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"icon-sm"}>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto scrollbar-none">
        <DialogHeader>
          <DialogTitle>Add Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input {...register("title")} />
              <FieldError>{errors.title?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input {...register("description")} />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Location</FieldLabel>
              <Input {...register("location")} />
              <FieldError>{errors.location?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Price</FieldLabel>
              <Input
                type="number"
                {...register("price", {
                  valueAsNumber: true,
                })}
                min={0}
              />
              <FieldError>{errors.price?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Category</FieldLabel>
              <Select
                onValueChange={(val) => {
                  setCatId(val);
                  setValue("serviceCatId", val);
                  setValue("features", []);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.data?.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.serviceCatId?.message}</FieldError>
            </Field>
            {selectedCategory?.featureCategories?.map((f) => (
              <Field
                key={f._id}
                orientation={f.type === "boolean" ? "horizontal" : "vertical"}
              >
                <FieldLabel className="flex-none!">{f.title}</FieldLabel>
                {f.type === "number" && (
                  <Input
                    type="number"
                    onChange={(e) =>
                      setFeatureValue(f._id, Number(e.target.value))
                    }
                    min={0}
                  />
                )}
                {f.type === "boolean" && (
                  <Checkbox
                    onCheckedChange={(checked) =>
                      setFeatureValue(f._id, Boolean(checked))
                    }
                  />
                )}
                {f.type === "array" && (
                  <>
                    {(
                      features.find((ff) => ff.featureCategoryId === f._id)
                        ?.value as string[]
                    )?.map((v) => {
                      return <span key={v}>{v}</span>;
                    })}
                    <div className="flex gap-x-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      />
                      <Button
                        disabled={input.trim() === ""}
                        onClick={() => {
                          addFeatureItem(f._id, input);
                          setInput("");
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </>
                )}
              </Field>
            ))}
            <Field>
              <FieldLabel>Images</FieldLabel>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setSelectedImages(Array.from(e.target.files ?? []))
                }
              />
            </Field>
            <Field>
              <FieldLabel>Areas</FieldLabel>
              <Select onValueChange={(val) => setValue("areaId", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.data?.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.areaId?.message}</FieldError>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant={"ghost"}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading||isSubmitting}>Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddService;
